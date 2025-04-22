import React, { useState, useEffect, useContext } from "react";
import ReactGA from 'react-ga4';
import theme from "../theme.jsx";
import { ToastContainer, toast } from "react-toastify" 

import {
	CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";

import {
	Paper,
  Typography,
	Divider,
	Button,
	Tooltip,
	Grid,
	Card,
} from "@mui/material";

import {
	red,
	green,
} from "../views/AngularWorkflow.jsx"
import { Context } from "../context/ContextApi.jsx";

//import { useAlert 

const Branding = (props) => {
    const { globalUrl, userdata, serverside, billingInfo,clickedFromOrgTab, stripeKey, selectedOrganization, handleGetOrg, } = props;
    //const alert = useAlert();
    const [publishingInfo, setPublishingInfo] = useState("");
	const [publishRequirements, setPublishRequirements] = useState([])

	const { leftSideBarOpenByClick } = useContext(Context)
 
  	const handleEditOrg = (joinStatus) => {
  	  const data = {
      	  "org_id": selectedOrganization.id,
		  "creator_config": joinStatus,
  	  };

  	  const url = globalUrl + `/api/v1/orgs/${selectedOrganization.id}`;
  	  fetch(url, {
  	    mode: "cors",
  	    method: "POST",
  	    body: JSON.stringify(data),
  	    credentials: "include",
  	    crossDomain: true,
  	    withCredentials: true,
  	    headers: {
  	      "Content-Type": "application/json; charset=utf-8",
  	    },
  	  })
  	    .then((response) =>
  	      response.json().then((responseJson) => {
  	        if (responseJson["success"] === false) {
  	          	toast("Failed updating org: ", responseJson.reason);
  	        } else {
				if (joinStatus == "join") {
					setPublishingInfo("Your organization is now part of the Partner Program. You can now create, publish and manage content for your organization's public page.")
				} else {
					setPublishingInfo("Your organization is no longer part of the Creator Incentive Program. You can still create a creator account to manage your organization's content.")
				}
          		handleGetOrg(selectedOrganization.id);
  	        }
  	      })
  	    )
  	    .catch((error) => {
  	      toast("Err: " + error.toString());
  	    });
  	};

    // Should enable / disable org branding
    const handleChangePublishing = () => {
      console.log("Handle change publishing");

	  if (selectedOrganization.creator_id == "") {
	  	handleEditOrg("join")
	  } else {
	  	handleEditOrg("leave")
	  }
    }

	const isOrganizationReady = () => {

		// Check if it's a suborg
		if (selectedOrganization.creator_org !== "") {
			const comment = "Child orgs can't become creators"
			if (!publishRequirements.includes(comment)) {
				setPublishRequirements([...publishRequirements, comment])
			}
			return false;
		}

		// A simple checklist to ensure the button shows up properly
		if (selectedOrganization.name === selectedOrganization.org) {
			const comment = "Change the name of your organization"
			if (!publishRequirements.includes(comment)) {
				setPublishRequirements([...publishRequirements, comment])
			}

			return false;
		}

		if (selectedOrganization.large_image === "" || selectedOrganization.large_image === theme.palette.defaultImage) {
			const comment = "Add a logo for your organization"
			if (!publishRequirements.includes(comment)) {
				setPublishRequirements([...publishRequirements, comment])
			}
			return false;
		}

		return true
	}

	const isPublished = selectedOrganization.creator_id === "" 
	const leadinfo = selectedOrganization.lead_info === undefined || selectedOrganization.lead_info === null || selectedOrganization.lead_info === "" ? "" : JSON.stringify(selectedOrganization.lead_info)
	const isPartner = leadinfo.includes("partner")


	return (
		<div style={{ width: clickedFromOrgTab? "100%": "auto", height: "100%", minHeight: 1100, boxSizing: 'border-box', transition: "width 0.3s ease", padding: "27px 10px 19px 27px", height: "auto", backgroundColor: '#212121', borderRadius: '16px', }}>
			<div style={{height: 843, overflowY: "auto",}}>
				<div style={{width: "100%", overflowX: 'hidden', }}>
				<Typography style={{fontSize: 24, fontWeight: "bold", marginTop: clickedFromOrgTab ?0:null,}}>
				Partner Status & Branding
			</Typography>
			<Typography variant="body1" color="textSecondary" style={{ marginTop: 10, marginBottom: 10, fontSize: 16 }}>
				You can customize your organization's branding by uploading a logo, changing the color scheme and a lot more. 
			</Typography>

			<Typography variant="body1" color="textSecondary" style={{display: 'flex', marginTop: 20, marginBottom: 10 }}>
					{isPublished ? <CheckCircleIcon style={{color: red, }} /> : <CheckCircleIcon style={{color: green, }} />}
		<span style={{marginLeft: 10, color: isPublished ? red : green, fontSize: 16 }}>{isPublished ? "Not Published" : "Published"}</span>
			</Typography>

			<a href="https://shuffler.io/partners" target="_blank" style={{ textDecoration: "none", }}>
				<Typography variant="body1" color="textSecondary" style={{display: 'flex', marginTop: 20, marginBottom: 10 }}>
					{!isPartner ? <CheckCircleIcon style={{color: red, }} /> : <CheckCircleIcon style={{color: green, }} />}
					<Tooltip title="Official Partner Program (manual verification)" placement="top" arrow>
						<span style={{marginLeft: 10, color: !isPartner ? red : green, fontSize: 16}}>{!isPartner? "Not Officially Partnered" : "Officially Partnered"}</span>
					</Tooltip>
				</Typography>
			</a>

			{!isPublished ? (
					<a 
						href={`/partners/${selectedOrganization.creator_id}/edit`} 
						target="_blank"
						style={{ textDecoration: "none" }} // Optional: remove underline
					>
						<Button 
						variant="contained" 
						style={{
							marginTop: 20, 
							marginBottom: 10, 
							textTransform: 'none', 
							fontSize: 16 
						}}
						>
						Modify Public Partner Details
						</Button>
					</a>
					) : (
					<Button 
						disabled 
						variant="contained" 
						style={{
						marginTop: 20, 
						marginBottom: 10, 
						textTransform: 'none', 
						fontSize: 16 
						}}
					>
						Modify Public Partner Details
					</Button>
					)}

			<Divider style={{marginTop: 50, marginBottom: 50, }} />
			<Typography style={{fontSize: 24, fontWeight: "bold"}}>
				Partner Program 
			</Typography>
			<div style={{ display: "flex", width: 900, marginTop: 10}}>
				<div>
					<span>
						<Typography variant="body1" color="textSecondary" style={{fontSize: 16}}>
							By changing publishing settings, you agree to our <a href="/docs/terms_of_service" target="_blank" style={{ textDecoration: "none", color: "#f86a3e"}}>Terms of Service</a>, and acknowledge that your organization's non-sensitive data will be added as a <a target="_blank" style={{ textDecoration: "none", color: "#f86a3e"}} href="https://shuffler.io/creators">creator account</a>. None of your existing workflows, apps, or other stored data will be published. Any admin in your organization can manage the creator configuration. Becoming a creator organization IS reversible.<div/>Support: <a href="mailto:support@shuffler.io"target="_blank" style={{ textDecoration: "none", color: "#f86a3e"}}>support@shuffler.io</a>
						</Typography>
						{selectedOrganization.creator_id == "" ? 
							<Typography variant="h6" color="textSecondary" style={{ marginTop: 20, marginBottom: 10, color: "grey", }}>
								&nbsp;
							</Typography>
						:
							null
						}

						<Button
							style={{ height: 40, marginTop: 10, width: 300, textTransform: 'none', fontSize: 18, backgroundColor: "#ff8544", color: "#1a1a1a" }}
							variant={selectedOrganization.creator_id == "" ? "contained" : "outlined"}
							color={selectedOrganization.creator_id == "" ? "primary" : "secondary"}
							disabled={!isOrganizationReady()}
							onClick={() => {
								handleChangePublishing();
							}}
						>
							{selectedOrganization.creator_id == "" ? "Join" : "Leave"} Partner Program 
							
						</Button>
						<Typography variant="body1" color="textSecondary" style={{ marginTop: 20, marginBottom: 10, color: "white", }}>
							{publishingInfo}
						</Typography>
						<Typography variant="body1" color="textSecondary" style={{ marginTop: 20, marginBottom: 10, color: "grey", }}>
							{publishRequirements.map((item) => {
								return (
									<div>
										Required: {item}
									</div>
								)
							})}
						</Typography>
					</span>
				</div>
			</div>
				</div>
			</div>
		</div>
	)
}

export default Branding;
