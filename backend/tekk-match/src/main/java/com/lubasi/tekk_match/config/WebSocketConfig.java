package com.lubasi.tekk_match.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@EnableWebSocketMessageBroker
@Configuration
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {

        // access link would be : ('http://localhost:8080/ms');
        registry.addEndpoint("/tekk").setAllowedOriginPatterns("*").withSockJS();

        // NEW: Endpoint for raw WebSocket clients (like Postman/dedicated tools)
        registry.addEndpoint("/postman").setAllowedOriginPatterns("*");

    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {

        // this is the web broker endpoint that manages how message are delivered
        registry.enableSimpleBroker("/gameroom");

        // it is a prefix used by the client to send message to the server
        registry.setApplicationDestinationPrefixes("/app");

        // for private user - we would not need private messages for now. Hence why it is commented
        //registry.setUserDestinationPrefix("/user");
    }
}
