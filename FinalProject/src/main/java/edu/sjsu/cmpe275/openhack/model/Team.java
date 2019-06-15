package edu.sjsu.cmpe275.openhack.model;

import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * 
 * @author pratikb
 *
 */
@Entity
public class Team {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="TEAM_ID")
	private Long teamId;
	
	@Column(nullable=false, unique=true)
	private String name;
	
	@ManyToOne
	@JsonIgnoreProperties(value= {"judgesHackathons", "ownsTeams"}, allowSetters = true)
	private User owner;
	
	private String submissionLink;
	
	private double score=-1;
	
	private int paidCount = 0;

	/* 
	 * List of users in this team who has made payments
	 */
	@ManyToMany(cascade={CascadeType.MERGE}, fetch = FetchType.LAZY)
	@JoinTable(name="paid_users",
		joinColumns={@JoinColumn(name="TEAM_ID", referencedColumnName="TEAM_ID")},
		inverseJoinColumns={@JoinColumn(name="USER_ID", referencedColumnName="USER_ID")})
	@JsonIgnoreProperties(value = {"password", "portraitUrl", "businessTitle", "aboutMe", "address", 
			"judgesHackathons", "teams", "isVerified", "role",
			"hibernateLazyInitializer", "handler","ownsTeams", "participantTeam"}, allowSetters = true)
	private Set<User> paidUsers;
	
	/**
	 * @return the owner
	 */
	public User getOwner() {
		return owner;
	}

	/**
	 * @param owner the owner to set
	 */
	public void setOwner(User owner) {
		this.owner = owner;
	}

	/**
	 * @return the paidCount
	 */
	public int getPaidCount() {
		return paidCount;
	}

	/**
	 * @param paidCount the paidCount to set
	 */
	public void setPaidCount(int paidCount) {
		this.paidCount = paidCount;
	}

	public Team() { }
	
	public Team(String name) {
		this.name = name;
	}
	
	public Team(Team obj) {
		this.name = obj.name;
		this.users = obj.users;
		this.hackathon = obj.hackathon;
		this.owner = obj.owner;
		this.paidCount = obj.paidCount;
		this.score = obj.score;
		this.submissionLink = obj.submissionLink;
	}
	
	@ManyToMany(cascade={CascadeType.MERGE}, fetch = FetchType.LAZY)
	@JoinTable(name="team_user",
		joinColumns={@JoinColumn(name="TEAM_ID", referencedColumnName="TEAM_ID")},
		inverseJoinColumns={@JoinColumn(name="USER_ID", referencedColumnName="USER_ID")})
	@JsonIgnoreProperties(value = {"password", "portraitUrl", "businessTitle", "aboutMe", "address", 
			"judgesHackathons", "teams", "hibernateLazyInitializer", "handler","ownsTeams","participantTeam"}, allowSetters = true)
	private Set<User> users;

	@ManyToOne
	@JsonIgnoreProperties(value = {"teams","judges","sponsors"})
	private Hackathon hackathon;
	
	public Set<User> getUsers() {
		return users;
	}

	public void setUsers(Set<User> users) {
		this.users = users;
	}

	/**
	 * @return the name
	 */
	public String getName() {
		return name;
	}
	
	/**
	 * @param name the name to set
	 */
	public void setName(String name) {
		this.name = name;
	}

	public Hackathon getHackathon() {
		return hackathon;
	}

	public void setHackathon(Hackathon hackathon) {
		this.hackathon = hackathon;
	}

	/**
	 * @return the teamId
	 */
	public Long getTeamId() {
		return teamId;
	}

	/**
	 * @param teamId the teamId to set
	 */
	public void setTeamId(Long teamId) {
		this.teamId = teamId;
	}

	public String getSubmissionLink() {
		return submissionLink;
	}

	public void setSubmissionLink(String submissionLink) {
		this.submissionLink = submissionLink;
	}

	public double getScore() {
		return score;
	}

	public void setScore(double score) {
		this.score = score;
	}

	/**
	 * @return the paidUsers
	 */
	public Set<User> getPaidUsers() {
		return paidUsers;
	}

	/**
	 * @param paidUsers the paidUsers to set
	 */
	public void setPaidUsers(Set<User> paidUsers) {
		this.paidUsers = paidUsers;
	}
	
	public void addPaidUsers(User paidUser) {
		this.paidUsers.add(paidUser);
	}
}
