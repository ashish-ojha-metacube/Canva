import React, { useState } from "react"
import styles from "../../styles/components.css";
import Loader from "./Loader";
const fetchTeams = () => {
   const [teams, setTeams] = useState(null);
   const [membersData, setMembersData] = useState(null);
   const [channelList, setChannelList] = useState(null);
   const [channelMessageList, setChannelMessageList] = useState(null);
   const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
   const [selectedChannelId, setSelectedChannelId] = useState<number | null>(null);
   const [isLoading, setIsLoading] = useState(false);
   const [isTeamspage, setisTeamspage] = useState(false);
   const [isChannelspage, setisChannelspage] = useState(false);
   const [isMessagepage, setisMessagepage] = useState(false);
//    fetch("http://localhost:3000/users/teams").then(response => response.json())
//    .then(data => {
//      // Handle the response data
//      console.log(data);
//    })
//    .catch(error => {
//      // Handle any errors
//      console.error(error);
//    });
const config = {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
}
   const teamsList = async () => {
    setIsLoading(true);
    //    console.log('get teams');
        await fetch("http://localhost:3000/teams", config).then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const clonedResponse = response.clone();
            return Promise.all([response.json()]);
          })
          .then(([json]) => {
            // Handle the response data
            console.log(json.teams);
            const newData =  json.teams;
            setisTeamspage(true);

            setTeams(newData);
            setIsLoading(false);
            // console.log("apiData : " , apiData);
            // console.log(text);
          })
          .catch(error => {
            // Handle any errors
            console.error(error);
          });
   }
   const getTeamDetail = async (teamId: number) => {
    setIsLoading(true);
    setSelectedTeamId(null);
    setMembersData(null);
    setChannelList(null);
    const [membersResponse, channelResponse] = await Promise.all([
      getTeamMembers(teamId),
      getTeamChannel(teamId),
    ]);
    // setMembersData(membersResponse);
    // setChannelList(membersResponse);
    setisTeamspage(false);
    setisChannelspage(true);
    setIsLoading(false);
      
   }

   const handleBack = ()=>{
      if(isChannelspage) {
        setisChannelspage(false);
        setisTeamspage(true);
      } else if(isMessagepage) {
        setisMessagepage(false);
        setisChannelspage(true);
      }
   }

   const getTeamMembers = async (teamId: number) => {
     console.log('id ======= ' , teamId);
     if (selectedTeamId === teamId) {
      setSelectedTeamId(null);
    } else {
      setSelectedTeamId(teamId);
    }
    await fetch(`http://localhost:3000/members/${teamId}`, config).then(response => {
      console.log('response ------- ' , response);
      
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // const clonedResponse = response.clone();
        return Promise.all([response.json()]);
      })
      .then(([json]) => {
        // Handle the response data
        console.log(json);
        const membersList =  json.members;
        setMembersData(membersList);
        // console.log("apiData : " , apiData);
        // console.log(text);
      })
      .catch(error => {
        // Handle any errors
        console.error(error);
      });
   }

  const getTeamChannel = async (teamId: number) => {
    console.log('id ======= ' , teamId);
    if (selectedTeamId === teamId) {
     setSelectedTeamId(null);
   } else {
     setSelectedTeamId(teamId);
   }
   await fetch(`http://localhost:3000/channels/${teamId}`, config).then(response => {
     console.log('response ------- ' , response);
     
       if (!response.ok) {
         throw new Error('Network response was not ok');
       }
       // const clonedResponse = response.clone();
       return Promise.all([response.json()]);
     })
     .then(([json]) => {
       // Handle the response data
      //  console.log(json);
       const channelList =  json.members;
       console.log('channelList ======= ' , channelList);
       setChannelList(channelList);
       
       // console.log("apiData : " , apiData);
       // console.log(text);
     })
     .catch(error => {
       // Handle any errors
       console.error(error);
     });
  }

  const getChannelMessage = async (teamId: number, channelId : number) => {
    setIsLoading(true);
    console.log('id ======= ' , teamId);
    if (selectedTeamId === teamId && selectedChannelId === channelId) {
     setSelectedTeamId(null);
     setSelectedChannelId(null);
   } else {
     setSelectedTeamId(teamId);
     setSelectedChannelId(channelId);
   }
   await fetch(`http://localhost:3000/messages/${teamId}/${channelId}`, config).then(response => {
     console.log('response ------- ' , response);
     
       if (!response.ok) {
         throw new Error('Network response was not ok');
       }
      //  // const clonedResponse = response.clone();
      // console.log('response.json() ========================= ' , response.json());
       return Promise.all([response.json()]);
     })
     .then(([json]) => {
       // Handle the response data
      //  console.log('jsonjsonjson [========' , json);
       const channelMeesage =  json.messages;
       console.log('channelMeesage === ' , channelMeesage);
       setisChannelspage(false);
       setisMessagepage(true);
       setChannelMessageList(channelMeesage);
       setIsLoading(false);
       
       // console.log("apiData : " , apiData);
       // console.log(text);
     })
     .catch(error => {
       // Handle any errors
       console.error(error);
     });
  }

  const history = async (name : string) =>{
    console.log('back');
  }
  //  
  

  return (
    <>
    {isLoading && Loader()}
    {!isLoading &&  <div>
      {!(isTeamspage || isChannelspage ||isMessagepage ) &&
      <button onClick={teamsList} className={styles.button}>Fetch API Data</button>}
      {teams && isTeamspage &&(
        <div className={styles.memberList}>
          <h3>Teams</h3>
         <ul>
             {/* {apiData} */}
           {teams.map(team => (
           <li key={team.id} style={{ borderBottom: '1px solid #fff', marginBottom: 10}}>
           
            <div onClick={() => getTeamDetail(team.id)} style={{ cursor: 'pointer' , marginBottom: 10}} >
               {team.displayName}
             </div>
           </li>
           ))}
           </ul>
         </div>
      )}
      
        
    {/* </div>
    <div> */}
               {!isLoading && <div >
                 {membersData && isChannelspage && (
                 <div className={styles.memberList} style={{paddingBottom: 10}}>
                   <h4>Team Members </h4>
                   <ul>
                     {membersData.map((data, index) => (
                       <li key={`${data.userId}-${index+1}`} id={`${data.userId}-${index+1}`}>
                         {data.displayName}
                       </li>
                     ))}
                   </ul>
                 </div>
                 )}


               {channelList  && isChannelspage && (
                 <div className={styles.memberList} style={{paddingBottom: 10}}>
                   <h4>Channel List </h4>
                   <ul>
                     {channelList.map((channel)=> (
                       <li key={channel.id} id={channel.id}>
                         <div onClick={() => getChannelMessage(channel.teamId, channel.id)} style={{ cursor: 'pointer' , marginBottom: 10}}>{channel.displayName}</div>

                         {/* {channelMessageList  && selectedChannelId === channel.id && (
                            <div>
                              <h5>Message List</h5>
                              <ul>
                                {channelMessageList.map(( messages) => (
                                  <li key={messages.id} id={messages.id} style={{marginBottom: 10}}>
                                   <p>{`From: ${messages?.from?.user?.displayName}`}</p>
                                   <span>{messages.body.content}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                         )} */}
                       </li>
                     ))}
                   </ul>
                 </div>
                 )}

                          {channelMessageList &&isMessagepage && (
                            <div>
                              <h5>Message List</h5>
                              <ul>
                                {channelMessageList.map(( messages) => (
                                  <li key={messages.id} id={messages.id} style={{marginBottom: 10}}>
                                   <p>{`From: ${messages?.from?.user?.displayName}`}</p>
                                   <span>{messages.body.content}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                         )}
               </div>}
    </div> }
    {(isChannelspage || isMessagepage) &&
    <button className={styles.button} onClick={handleBack}>Back</button>
    }
    </>
  );
 }
 export default fetchTeams;