package edu.sjsu.cmpe275.openhack.model;

import java.util.HashSet;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * 
 * @author adityadoshatti
 *
 */
@Entity
public class Organization {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ORGANIZATION_ID")
	private Long id;
	@Column(unique=true)
	private String name;
	
	@OneToOne
	@JsonIgnoreProperties(value = {"password", "portraitUrl", "businessTitle", "aboutMe", "address", 
			"judgesHackathons", "organization", "hibernateLazyInitializer", "handler"}, allowSetters = true)
	private User owner;
	
	private String description;
	
	@OneToMany
	@JsonIgnoreProperties(value = {"password", "portraitUrl", "businessTitle", "aboutMe", "address", 
			"judgesHackathons", "organization", "hibernateLazyInitializer", "handler"}, allowSetters = true)
	private Set<User> orgUsers;
	
	@OneToMany
	@JsonIgnoreProperties(value = {"password", "portraitUrl", "businessTitle", "aboutMe", "address", 
			"judgesHackathons", "organization","role", "hibernateLazyInitializer", "handler"}, allowSetters = true)
	private Set<User> pendingApprovals;

	@Embedded
	private Address address;
	
	@ManyToMany(mappedBy = "sponsors")
	@JsonIgnoreProperties(value = {"description", "startDate", "endDate", "regFees", "isOpen", 
			"minTeamSize", "maxTeamSize", "judges", "sponsors", "hibernateLazyInitializer", "handler"}, allowSetters = true)
	private Set<Hackathon> hackathons = new HashSet<Hackathon>();
	
	public Organization () {	
	}
	
	public Organization(String name, User owner, String description, Address address) {
		super();
		this.name = name;
		this.owner = owner;
		this.description = description;
		this.address = address;
	}

	public Organization(Organization org) {
		super();
		this.name = org.name;
		this.owner = org.owner;
		this.description = org.description;
		this.address = org.address;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public User getOwner() {
		return owner;
	}

	public void setOwner(User owner) {
		this.owner = owner;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Address getAddress() {
		return address;
	}

	public void setAddress(Address address) {
		this.address = address;
	}
	
	public Set<User> getOrgUsers() {
		return orgUsers;
	}

	public void setOrgUsers(Set<User> orgUsers) {
		this.orgUsers = orgUsers;
	}
	
	public void addOrgUser(User user) {
		this.orgUsers.add(user);
	}

	public Set<User> getPendingApprovals() {
		return pendingApprovals;
	}

	public void setPendingApprovals(Set<User> pendingApprovals) {
		this.pendingApprovals = pendingApprovals;
	}

	/**
	 * @return the hackathons
	 */
	public Set<Hackathon> getHackathons() {
		return hackathons;
	}

	/**
	 * @param hackathons the hackathons to set
	 */
	public void setHackathons(Set<Hackathon> hackathons) {
		this.hackathons = hackathons;
	}
	
	public void addHackathon(Hackathon hackathon) {
		this.hackathons.add(hackathon);
	}	
}
