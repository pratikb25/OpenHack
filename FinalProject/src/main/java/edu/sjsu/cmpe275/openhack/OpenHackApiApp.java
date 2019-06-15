package edu.sjsu.cmpe275.openhack;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/**
 * API Application class
 * @author adityadoshatti
 *
 */
@SpringBootApplication
public class OpenHackApiApp {
	public static void main(String[] args) {
		SpringApplication.run(OpenHackApiApp.class, args);
	}
	
}
