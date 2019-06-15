package edu.sjsu.cmpe275.openhack.controller;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;


public class CorsConfiguration extends WebMvcConfigurerAdapter {

//        @Override
//        public void addCorsMappings(CorsRegistry registry) {
//            registry.addMapping("/**")
//                .allowedOrigins("http://localhost:3000")
//                .allowedMethods("PUT", "DELETE","GET","POST","OPTIONS")
//                .allowedHeaders("Access-Control-Allow-Origin", "Origin","Accept", "X-Requested-With","Content-Type","Access-Control-Request-Method","Access-Control-Request-Headers")
//                .exposedHeaders("Access-Control-Allow-Origin", "Origin","Accept", "X-Requested-With","Content-Type","Access-Control-Request-Method","Access-Control-Request-Headers")
//                .allowCredentials(true).maxAge(3600);
//        }
 }