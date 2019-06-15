package edu.sjsu.cmpe275.openhack.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import edu.sjsu.cmpe275.openhack.model.HackathonExpense;
import edu.sjsu.cmpe275.openhack.service.HackathonExpenseService;

/**
 * 
 * @author pratikb
 *
 */
@RestController
public class HackathonExpenseController {
	
	@Autowired
	HackathonExpenseService expService;

	@RequestMapping(method=RequestMethod.GET, value = "/expenses", produces = { "application/json", "application/xml" })
	public ResponseEntity<List<HackathonExpense>> getAllExpenses() {
		return ResponseEntity.ok(expService.getAllExpenses());
	}
	
	@RequestMapping(method=RequestMethod.GET, value = "/expenses/{hackId}", produces = { "application/json", "application/xml" })
	public ResponseEntity<List<HackathonExpense>> getExpenseByHackathonId(@PathVariable Long hackId) {
		List<HackathonExpense> h = expService.findExpenseByHackathonId(hackId);
		if(h == null)
			return ResponseEntity.notFound().build();
		return ResponseEntity.ok(h);
	}
	
	@RequestMapping(method=RequestMethod.POST, value = "/expenses", produces = { "application/json", "application/xml" })
	public ResponseEntity<HackathonExpense> addExpense(@RequestBody HackathonExpense h) {
		if(h == null)
			return ResponseEntity.badRequest().build();
		HackathonExpense result = expService.addExpense(h);
		if(result == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		return ResponseEntity.ok(result);
	}
}
