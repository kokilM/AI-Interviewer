package com.ai.SpringAiDemo2.stt;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service

public class DeepgramSTTService {

    @Value("${deepgram.api.key}")
    private String apiKey;

    private final String DEEPGRAM_API_URL = "https://api.deepgram.com/v1/listen";

    

    public String transcribeAudio(MultipartFile audioFile) throws IOException {
        System.out.println("Inside DeepgramSTTService :" + audioFile);
        RestTemplate restTemplate = new RestTemplate();
    
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Token " + apiKey);
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        System.out.println("before HttpHeaders:" + headers);
    
        byte[] audioBytes = audioFile.getBytes();
        HttpEntity<byte[]> requestEntity = new HttpEntity<>(audioBytes, headers);
        System.out.println("requestEntity:" + requestEntity);
    
        ResponseEntity<Map> response = restTemplate.postForEntity(
                DEEPGRAM_API_URL, 
                requestEntity,
                Map.class
        );
    
        System.out.println("------- going to get DeepgramSTTService ------" + response);
    
        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            try {
                Map<String, Object> result = response.getBody();
                List<Map<String, Object>> channels = (List<Map<String, Object>>)
                        ((Map<String, Object>) result.get("results")).get("channels");
    
                if (!channels.isEmpty()) {
                    List<Map<String, Object>> alternatives = (List<Map<String, Object>>)
                            channels.get(0).get("alternatives");
    
                    if (!alternatives.isEmpty()) {
                        return (String) alternatives.get(0).get("transcript");
                    }
                }
            } catch (Exception e) {
                throw new IOException("Invalid Deepgram response format", e);
            }
        }
    
        throw new IOException("Failed to transcribe audio. Status: " + response.getStatusCode());
    }
    
}
