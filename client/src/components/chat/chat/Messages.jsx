import { useState, useEffect, useContext, useRef } from 'react';
import { Box, styled } from '@mui/material';
import { AccountContext } from '../../../context/AccountProvider';
import { newMessage, getMessages } from '../../../service/api';

// Components
import Footer from "./Footer";
import Message from "./Message";


import { io } from 'socket.io-client';

const Wrapper = styled(Box)`
    background-image: url(${'https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png'});
    background-size: 50%;
`;

const StyledFooter = styled(Box)`
    height: 55px;
    background: #ededed;
    // position: absolute;
    width: 100%;
    // bottom: 0
`;

const Component = styled(Box)`
    height: 78vh;
    overflow-y: scroll;
`;

const Container = styled(Box)`
    padding: 1px 50px;
`;

const Messages = ({ person, conversation }) => {
  const [messages, setMessages] = useState([]);
  const [incomingMessage, setIncomingMessage] = useState(null);
  const [value, setValue] = useState("");
  const [file, setFile] = useState();
  const [image, setImage] = useState();

  const scrollRef = useRef();

  const { account, socket, newMessageFlag, setNewMessageFlag } = useContext(AccountContext);

  useEffect(() => {
    socket.current.on('getMessage', data => {
      setIncomingMessage({
        ...data,
        createdAt: Date.now()
      })
    })
  }, []);

  useEffect(() => {
    const getMessageDetails = async () => {
      let data = await getMessages(conversation?._id);
      setMessages(data);
    }
    conversation._id && getMessageDetails();
  }, [conversation?._id, person._id, newMessageFlag]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ transition: "smooth" })
  }, [messages]);

  useEffect(() => {
    incomingMessage && conversation?.members?.includes(incomingMessage.senderId) &&
      setMessages((prev) => [...prev, incomingMessage]);

  }, [incomingMessage, conversation]);

  // const receiverId = conversation?.members?.find(member => member !== account.sub);

  const sendText = async (e) => {
    let code = e.keyCode || e.which;
    if (!value) return;

    if (code === 13) {
      let message = {};
      if (!file) {
        message = {
          senderId: account.sub,
          receiverId: person.sub, //receiverId
          conversationId: conversation._id,
          type: 'text',
          text: value
        };
      } else {
        message = {
          senderId: account.sub,
          conversationId: conversation._id,
          receiverId: person.sub,
          type: 'file',
          text: image
        };
      }
      console.log("message", message)

      socket.current.emit('sendMessage', message);

      await newMessage(message);

      setValue('');
      setFile();
      setImage('');
      setNewMessageFlag(prev => !prev);
    }
  }

  return (
    <Wrapper>
      <Component>
        {
          messages && messages.map(message => (
            <Container ref={scrollRef}>
              <Message message={message} />
            </Container>
          ))
        }
      </Component>
      <Footer
        sendText={sendText}
        setValue={(setValue)}
        value={value}
        // setValue={setValue}
        setFile={setFile}
        file={file}
        setImage={setImage}
      />
    </Wrapper>
  )
}

export default Messages