package com.ai.SpringAiDemo2.service;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import org.springframework.web.client.HttpClientErrorException;

@Service
public class TextToSpeechService {

    @Value("${deepgram.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    

    public byte[] synthesizeSpeech(String text) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Token " + apiKey);
            headers.set("Content-Type", "application/json");
            

            // String jsonBody = "{\"text\":\"" + text + "\"}";
            JSONObject object= new JSONObject();
            String jsonBody= object.put("text", text).toString();
            
            // System.out.println("Request URL: https://api.deepgram.com/v1/speak");
            // System.out.println("Request Headers: " + headers);
            // System.out.println("Request Body: " + jsonBody);

            HttpEntity<String> requestEntity = new HttpEntity<>(jsonBody, headers);
            ResponseEntity<byte[]> apiResponse = restTemplate.exchange(
                "https://api.deepgram.com/v1/speak",
                HttpMethod.POST,
                requestEntity,
                byte[].class
                
            );

            if (apiResponse.getStatusCode().is2xxSuccessful()) {
                
                byte[] responseBody = apiResponse.getBody();
                System.out.println("Successful response received. ");
                return responseBody;
            } else {
                System.err.println("Received error response: " + apiResponse.getStatusCode());
                return null;
            }
        } catch (Exception e) {
            System.err.println("Full error in synthesizeSpeech: " + e.getMessage());
            if (e instanceof HttpClientErrorException) {
                HttpClientErrorException httpError = (HttpClientErrorException) e;
                System.err.println("Response body: " + httpError.getResponseBodyAsString());
            }
            e.printStackTrace();
            return null;
        }
    }

    public void synthesizeSpeech(String text, HttpServletResponse response) throws IOException {
        
        if (text == null || text.trim().isEmpty()) {
            System.err.println("Empty text received");
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Text cannot be empty");
            
            return;
        }

        byte[] audioData = synthesizeSpeech(text);
        if (audioData != null && audioData.length > 0) {
            response.setContentType("audio/wav");
            response.setHeader("Content-Disposition", "inline; filename=\"speech.wav\"");
            try (OutputStream out = response.getOutputStream()) {
                out.write(audioData);
                out.flush();
            }
            System.out.println("Audio response sent successfully.");
        } else {
            System.err.println("TTS synthesis failed. No audio data received ");
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to generate audio");

        }
    }    
    
}
