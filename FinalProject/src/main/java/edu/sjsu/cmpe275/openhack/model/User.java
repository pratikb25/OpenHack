package edu.sjsu.cmpe275.openhack.model;

import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * 
 * @author adityadoshatti
 *
 */
@Entity
public class User {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="USER_ID")
	private Long id;
	
	@Column(name="screenName")
	private String screenName;
	
	@Column(name="name")
	private String name;
	
	@Column(name="email",nullable = false, unique = true)
	private String email;
	
	@Column(name="password")
	private String password;
	
	@Column(name="portraitUrl")
	private String portraitUrl;
	
	@Column(name="businessTitle")
	private String businessTitle;
	
	@Column(name="aboutMe")
	private String aboutMe;
	
	@Column(name="address")
	private String address;
	
	@Column(name="isVerified")
	@org.hibernate.annotations.ColumnDefault("false")
	private String isVerified;
	
	@Column(name="role")
//	@org.hibernate.annotations.ColumnDefault("hacker")
	private String role;
	
	private boolean paid = false;

	// List of all hackathons judged by this user
	@ManyToMany(mappedBy = "judges")
	@JsonIgnoreProperties(value = {"description", "startDate", "endDate", "regFees", "isOpen", "teams",
			"minTeamSize", "maxTeamSize", "judges", "sponsors", "hibernateLazyInitializer", "handler"}, allowSetters = true)
	private Set<Hackathon> judgesHackathons;
	
	@OneToMany(mappedBy = "owner")
	@JsonIgnoreProperties(value = {"owner", "users"}, allowSetters = true)
	private Set<Team> ownsTeams;
	
	
	@ManyToMany(mappedBy = "users")
	@JsonIgnoreProperties(value = {"users", "owner", "paidUsers"}, allowSetters = true)
	private Set<Team> participantTeam;
	
	@ManyToMany(mappedBy = "paidUsers")
	@JsonIgnoreProperties(value = {"users", "owner", "paidUsers"}, allowSetters = true)
	private Set<Team> paymentForTeam;
	
	@Column(name="isOwner",nullable = true)
	private boolean isOwner=false;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "ORGANIZATION_ID")
	@JsonIgnoreProperties(value = {"owner", "description", "orgUsers", "address", "hackathons", "hibernateLazyInitializer", "handler"}, allowSetters = true)
	private Organization organization;

	/**
	 * @return the judgesHackathons
	 */
	public Set<Hackathon> getJudgesHackathons() {
		return judgesHackathons;
	}

	/**
	 * @param judgesHackathons the judgesHackathons to set
	 */
	public void setJudgesHackathons(Set<Hackathon> judgesHackathons) {
		this.judgesHackathons = judgesHackathons;
	}
	
	public void addJudgesHackathons(Hackathon obj) {
		this.judgesHackathons.add(obj);
	}

	public User() {
		
	}
	
	public User(User user) {
		super();
		this.screenName=user.screenName;
		this.name = user.name;
		this.email=user.email;
		this.isVerified="false";
		this.password=user.password;
		this.aboutMe=user.aboutMe;
		this.businessTitle=user.businessTitle;
		this.portraitUrl=user.portraitUrl;
		this.address=user.address;
		this.paid = user.paid;
		this.role = user.role;
		this.isOwner = user.isOwner;
		this.judgesHackathons = user.judgesHackathons;
		this.organization = user.organization;
		this.ownsTeams = user.ownsTeams;
		this.participantTeam = user.participantTeam;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	
	public String getScreenName() {
		return screenName;
	}

	public void setScreenName(String screenName) {
		this.screenName = screenName;
	}

	public String getName() {
		return name;
	}

	
	public String getIsVerified() {
		return isVerified;
	}

	public void setIsVerified(String isVerified) {
		this.isVerified = isVerified;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getPortraitUrl() {
		return portraitUrl;
	}

	public void setPortraitUrl(String portraitUrl) {
		this.portraitUrl = portraitUrl;
	}

	public String getBusinessTitle() {
		return businessTitle;
	}

	public void setBusinessTitle(String businessTitle) {
		this.businessTitle = businessTitle;
	}

	public String getAboutMe() {
		return aboutMe;
	}

	public void setAboutMe(String aboutMe) {
		this.aboutMe = aboutMe;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public Organization getOrganization() {
		return organization;
	}

	public void setOrganization(Organization organization) {
		this.organization = organization;
	}

	public boolean isOwner() {
		return isOwner;
	}

	public void setOwner(boolean isOwner) {
		this.isOwner = isOwner;
	}

	/**
	 * @return the paid
	 */
	public boolean isPaid() {
		return paid;
	}

	/**
	 * @param paid the paid to set
	 */
	public void setPaid(boolean paid) {
		this.paid = paid;
	}

	public Set<Team> getOwnsTeams() {
		return ownsTeams;
	}

	public void setOwnsTeams(Set<Team> ownsTeams) {
		this.ownsTeams = ownsTeams;
	}

	public Set<Team> getParticipantTeam() {
		return participantTeam;
	}

	public void setParticipantTeam(Set<Team> participantTeam) {
		this.participantTeam = participantTeam;
	}

	/**
	 * @return the paymentForTeam
	 */
	public Set<Team> getPaymentForTeam() {
		return paymentForTeam;
	}

	/**
	 * @param paymentForTeam the paymentForTeam to set
	 */
	public void setPaymentForTeam(Set<Team> paymentForTeam) {
		this.paymentForTeam = paymentForTeam;
	}
	
}
