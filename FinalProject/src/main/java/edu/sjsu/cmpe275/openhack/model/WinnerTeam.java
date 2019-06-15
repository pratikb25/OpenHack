package edu.sjsu.cmpe275.openhack.model;

import java.util.List;

public class WinnerTeam {
	private String hackName;
	private List<String> emails;
	private Boolean isWinner;
	
	public WinnerTeam() {}
	
	public WinnerTeam(WinnerTeam w) {
		hackName = w.hackName;
		emails = w.emails;
		isWinner = w.isWinner;
	}
	
	/**
	 * @return the hackName
	 */
	public String getHackName() {
		return hackName;
	}
	/**
	 * @param hackName the hackName to set
	 */
	public void setHackName(String hackName) {
		this.hackName = hackName;
	}
	/**
	 * @return the emails
	 */
	public List<String> getEmails() {
		return emails;
	}
	/**
	 * @param emails the emails to set
	 */
	public void setEmails(List<String> emails) {
		this.emails = emails;
	}

	/**
	 * @return the isWinner
	 */
	public Boolean getIsWinner() {
		return isWinner;
	}

	/**
	 * @param isWinner the isWinner to set
	 */
	public void setIsWinner(Boolean isWinner) {
		this.isWinner = isWinner;
	}
	
}
