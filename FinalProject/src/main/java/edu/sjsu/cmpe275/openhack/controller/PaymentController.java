package edu.sjsu.cmpe275.openhack.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import edu.sjsu.cmpe275.openhack.model.PaymentDetails;
import edu.sjsu.cmpe275.openhack.model.PaymentDetailsMap;
import edu.sjsu.cmpe275.openhack.service.PaymentService;
import edu.sjsu.cmpe275.openhack.service.TeamService;
import edu.sjsu.cmpe275.openhack.service.UserService;

@RestController
public class PaymentController {
	
	@Autowired
	PaymentService paymentService;
	
	@Autowired
	TeamService teamService;
	
	@Autowired
	UserService userService;

	@RequestMapping(method=RequestMethod.GET,value = "/payments/{teamId}", produces = { "application/json", "application/xml" })
	public ResponseEntity<List<PaymentDetailsMap>> getPaymentDetails(@PathVariable Long teamId) {
		List<PaymentDetails> details = paymentService.getPayments(teamId);
		List<PaymentDetailsMap> retVal = new ArrayList<>();
		for(PaymentDetails det:details) {
			PaymentDetailsMap obj = new PaymentDetailsMap();
			obj.setAmount(det.getAmount());
			obj.setDate(det.getDate());
			obj.setPaymentId(det.getPaymentId());
			obj.setTeam(teamService.getTeamById(det.getTeamId()));
			obj.setUser(userService.getUser(det.getUserId()));
			retVal.add(obj);
		}
		return ResponseEntity.ok(retVal);
	}
}
