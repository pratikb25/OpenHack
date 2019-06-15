package edu.sjsu.cmpe275.openhack.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.sjsu.cmpe275.openhack.model.PaymentDetails;

/**
 * 
 * @author pratikb
 *
 */
public interface PaymentRepository extends JpaRepository<PaymentDetails, Long> {	
		
}
