package edu.sjsu.cmpe275.openhack.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import edu.sjsu.cmpe275.openhack.model.Team;

/**
 * 
 * @author pratikb
 *
 */

public interface TeamRepository extends JpaRepository<Team, Long> {	
	
}
