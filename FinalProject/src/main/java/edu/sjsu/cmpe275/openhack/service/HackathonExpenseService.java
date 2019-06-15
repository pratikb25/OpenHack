package edu.sjsu.cmpe275.openhack.service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import edu.sjsu.cmpe275.openhack.model.Hackathon;
import edu.sjsu.cmpe275.openhack.model.HackathonExpense;
import edu.sjsu.cmpe275.openhack.repository.HackathonExpenseRepository;
import edu.sjsu.cmpe275.openhack.repository.HackathonRepository;

@Service
public class HackathonExpenseService {

	@Autowired(required=true)
	HackathonExpenseRepository hackExpRepo;
	
	@Autowired(required=true)
	HackathonRepository hackRepo;
	
	public List<HackathonExpense> findExpenseByHackathonId(Long hackId) {
		Hackathon h = hackRepo.findOne(hackId);
		if(h != null)
			return hackExpRepo.findByHackathonForExpense(h);
		return null;
	}
	
	public List<HackathonExpense> getAllExpenses() {
		return hackExpRepo.findAll();
	}

	public HackathonExpense addExpense(HackathonExpense h) {
		if(h == null) return null;
		System.out.println("PRATIKB " + h.getHackathonForExpense().getId());
		Date date = Calendar.getInstance().getTime();
		DateFormat dateFormat = new SimpleDateFormat("yyyy-mm-dd hh:mm:ss");
		String strDate = dateFormat.format(date);
		h.setTime(strDate);
		hackExpRepo.save(h);
		return h;
	}
}
