package edu.sjsu.cmpe275.openhack.service;

import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import edu.sjsu.cmpe275.openhack.model.PaymentDetails;
import edu.sjsu.cmpe275.openhack.repository.PaymentRepository;

/**
 * 
 * @author pratikb
 *
 */
@Service
public class PaymentService {
	
	@Autowired
	PaymentRepository paymentRepo;
	
	@Autowired
	private EntityManager entityManager;
	
	@SuppressWarnings("unchecked")
	public List<PaymentDetails> getPayments(Long teamId) {
		Query query = entityManager.createQuery("from PaymentDetails as p WHERE p.teamId=:t");
		query.setParameter("t", teamId);
		List<PaymentDetails> results = (List<PaymentDetails>) query.getResultList();
		if(results == null) return null;
		return (List<PaymentDetails>) results;
	}
	
	public void savePayment(PaymentDetails obj) {
		if(obj != null)
			paymentRepo.save(obj);
	}
}
