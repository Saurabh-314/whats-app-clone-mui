import React, { useEffect, useState, useContext } from 'react'
import { Box, styled, Divider } from "@mui/material";
import { AccountContext } from '../../../context/AccountProvider';
import { getUsers, } from '../../../service/api'

// components
import Conversation from './Conversation';

const Component = styled(Box)`
    overflow: overlay;
    height: 81vh;
`;

const StyledDivider = styled(Divider)`
    margin: 0 0 0 70px;
    background-color: #e9edef;
    opacity: .6;
`;


const Conversations = ({ text }) => {
  const [users, setUsers] = useState([]);
  const { account, socket, setActiveUsers } = useContext(AccountContext);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getUsers();
      let filteredData = res.filter(user => user.name.toLowerCase().includes(text.toLowerCase()));
      setUsers(filteredData);
    }
    fetchData();
  }, [text])

  useEffect(() => {
    socket.current.emit('addUser', account);
    socket.current.on("getUsers", users => {
      setActiveUsers(users);
    })
  }, [account])


  return (
    <Component>
      {
        users.map(user => {
          return (
            user.sub !== account.sub &&
            <>
              <Conversation user={user} account={account} />
              <StyledDivider />
            </>
          )
        })
      }
    </Component>
  )
}

export default Conversations