package com.ai.SpringAiDemo2;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Flux;
import org.springframework.http.codec.ServerSentEvent;
import java.time.Duration;
import java.util.Map;
import java.util.HashMap;
 
import com.ai.SpringAiDemo2.service.TextToSpeechService;
import com.ai.SpringAiDemo2.stt.DeepgramSTTService;


import jakarta.servlet.http.HttpServletResponse;
// import reactor.core.publisher.Mono;

// import com.ai.SpringAiDemo2.service.TextToSpeechService;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.InMemoryChatMemory;
import org.springframework.ai.mistralai.MistralAiChatOptions;
import org.springframework.beans.factory.annotation.Autowired;


import java.io.IOException;


@RestController
@RequestMapping("")
@CrossOrigin(origins = "*")
public class GenAiController {
    private static final String SYSTEM_PROMPT_TEMPLATE = 
        "You are a real-time technical interviewer conducting an interview for %s technology.\n" +
"Follow this exact sequence and rules strictly.\n" +
"\n" +
"IMPORTANT: Do not begin the interview until the candidate says 'hello'.\n" +
"When the candidate says 'hello', respond only with this exact question:\n" +
"'What is your name and a brief background?'\n" +
"\n" +
"Then follow this sequence:\n" +
"\n" +
"1. Wait for their response. Do not continue until they respond.\n" +
"2. Ask exactly this question: 'Can you describe the projects you've worked on?'\n" +
"3. Wait for their response. Do not continue until they respond.\n" +
"4. Ask exactly ONE follow-up question about their project. Do not combine or ask multiple questions.\n" +
"5. Wait for their response. Do not continue until they respond.\n" +
"\n" +
"6. Begin the technical interview in %s. Ask exactly 3 intermediate-level questions in %s.\n" +
"7. Ask only ONE question at a time.\n" +
"8. Wait for the candidate's response before asking the next one.\n" +
"9. Never ask more than one question at a time. Ask only one question strictly.\n" +
"10. Format each question exactly like this: 'Question [number]: [Full question]'\n" +
"11. Do not answer the questions yourself. Only wait for the candidate's response.\n" +
"\n" +
"12. After all 3 answers are received, ask exactly this and nothing else: 'Would you like to see your interview score? (yes/no)'\n" +
"\n" +
"13. If the candidate answers 'yes', show their score like this:\n" +
"'Your interview score is: [calculated score out of 3]. Thank you for completing the interview.'\n" +
"\n" +
"14. If the candidate answers 'no', say: 'Thank you for completing the interview.'\n" +
"\n" +
"Important rules:\n" +
"1. Ask only ONE question at a time and strictly follow it no matter what.\n" +
"2. Wait for the candidate's response before continuing.\n" +
"3. Never combine two questions into one.\n" +
"4. Never say things like 'Next question', 'Let's move on', or 'That's okay'.\n" +
"5. Do not comment on the user's responses.\n" +
"6. Do not refer to earlier answers.\n" +
"7. Keep the conversation focused only on the current question.\n" +
"8. Do not add anything extra before questions like 'I am AI and I have to ask this question' – just stick to asking questions.\n" +
"9. Do not include answers to the questions. Only ask questions and wait for the candidate to respond.\n" +
"10. If the user asks anything outside of this interview process, reply only with: 'Sorry, that is out of my expertise.'";

    private String selectedTechnology;
    private ChatClient chatClient;
    private final ChatClient.Builder builder;

    public GenAiController(ChatClient.Builder builder) {
        this.selectedTechnology = ""; 
        this.chatClient = null; 
        this.builder = builder;
    }

    @PostMapping("/set-technology")
    public ResponseEntity<Map<String, String>> setTechnology(@RequestBody Map<String, String> payload) {
        String technology = payload.get("technology");
        if (technology == null || technology.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Technology cannot be empty"));
        }

        this.selectedTechnology = technology;
        String systemPrompt = String.format(SYSTEM_PROMPT_TEMPLATE, technology, technology, technology);
        
        this.chatClient = this.builder
                .defaultAdvisors(new MessageChatMemoryAdvisor(new InMemoryChatMemory()))
                .defaultSystem(systemPrompt)
                .build();

        return ResponseEntity.ok(Map.of("message", "Technology set to: " + technology));
    }

    @Autowired
    private TextToSpeechService ttsService;
    @Autowired
    private DeepgramSTTService sttService;

    @GetMapping("/ask")
    public ResponseEntity<Map<String, String>> askQuestion(
            @RequestParam(name="question") String question,
            @RequestParam(name="technology", defaultValue="any") String technology) {
        
        if (!technology.equals(this.selectedTechnology)) {
            this.selectedTechnology = technology;
            String systemPrompt = String.format(SYSTEM_PROMPT_TEMPLATE, technology, technology, technology);
            this.chatClient = this.builder
                    .defaultAdvisors(new MessageChatMemoryAdvisor(new InMemoryChatMemory()))
                    .defaultSystem(systemPrompt)
                    .build();
        }

        if (this.chatClient == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Chat client not initialized"));
        }

        String aiResponse = getResponse(question);
        Map<String, String> response = new HashMap<>();
        response.put("message", aiResponse != null ? aiResponse : "Waiting for AI to generate question...");
        return ResponseEntity.ok(response);
    }

    public String responsebyai;
    private String getResponse(String question) {
        if (question == null || question.isEmpty()) {
            return "";
        }
        MistralAiChatOptions options = MistralAiChatOptions.builder()
                .withMaxTokens(1000)
                .withModel("llama-3.3-70b-versatile")
                .build();

        System.out.println("Received question: " + question);
        responsebyai = chatClient
                .prompt(question)
                .options(options)
                .call()
                .content();
        return responsebyai;
    }

    @PostMapping("/ask-audio")
    public void askAiAudio(@RequestBody Map<String, String> payload, HttpServletResponse response) throws IOException {
        try {
            String userInput = payload.get("message");
            String technology = payload.get("technology");
            System.out.println("Received ask-audio request with payload: " + userInput);

            if (userInput == null || userInput.trim().isEmpty()) {
                System.err.println("Empty message received in payload");
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Message cannot be empty");
                return;
            }

            if (technology != null && !technology.equals(this.selectedTechnology)) {
                this.selectedTechnology = technology;
                String systemPrompt = String.format(SYSTEM_PROMPT_TEMPLATE, technology, technology, technology);
                this.chatClient = this.builder
                        .defaultAdvisors(new MessageChatMemoryAdvisor(new InMemoryChatMemory()))
                        .defaultSystem(systemPrompt)
                        .build();
            }

            if (this.chatClient == null) {
                System.err.println("Chat client not initialized");
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Chat client not initialized");
                return;
            }

            MistralAiChatOptions options = MistralAiChatOptions.builder()
                    .withMaxTokens(1000)
                    .withModel("llama-3.3-70b-versatile")
                    .build();

            String aiResponse = chatClient.prompt(userInput)
                    .options(options)
                    .call()
                    .content();

            System.out.println("AI generated response: " + aiResponse);

            if (aiResponse == null || aiResponse.trim().isEmpty()) {
                System.err.println("Empty response from AI");
                response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "AI generated empty response");
                return;
            }

            ttsService.synthesizeSpeech(responsebyai, response);
        } catch (Exception e) {
            System.err.println("Error in askAiAudio: " + e.getMessage());
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to process request: " + e.getMessage());
        }
    }

    @PostMapping("/transcribe")
    public ResponseEntity<String> transcribeAudio(@RequestParam(name="audio", required = false) MultipartFile file) {
        try {
            String transcript = sttService.transcribeAudio(file);
            return ResponseEntity.ok(transcript);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Transcription failed: " + e.getMessage());
        }
    }

    @GetMapping(value = "/ask-reactive", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<Map<String, String>> askQuestionReactive(
            @RequestParam(name="question") String question,
            @RequestParam(name="technology", defaultValue="java") String technology) {
        
        return Mono.fromCallable(() -> {
            if (!technology.equals(this.selectedTechnology)) {
                this.selectedTechnology = technology;
                String systemPrompt = String.format(SYSTEM_PROMPT_TEMPLATE, technology, technology, technology);
                this.chatClient = this.builder
                        .defaultAdvisors(new MessageChatMemoryAdvisor(new InMemoryChatMemory()))
                        .defaultSystem(systemPrompt)
                        .build();
            }

            if (this.chatClient == null) {
                throw new RuntimeException("Chat client not initialized");
            }

            String aiResponse = getResponse(question);
            Map<String, String> response = new HashMap<>();
            response.put("message", aiResponse != null ? aiResponse : "Waiting for AI to generate question...");
            return response;
        });
    }
}
