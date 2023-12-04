import React from "react";
import io from "socket.io-client";
import Video from "./Video.js";
import './meeting.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faMicrophoneSlash,
  faVideo,
  faVideoSlash,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

class Meeting extends React.Component {
  constructor(props) {
    super(props);

    this.pc_config = {
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
            "stun:stun3.l.google.com:19302",
            "stun:stun4.l.google.com:19302",
          ],
        },
      ],
    };
    this.SOCKET_SERVER_URL = "https://port-0-video-conference-prototype-with-webrtc-3yl7k2bloogc04p.sel5.cloudtype.app/";

    this.socketRef = React.createRef();
    this.pcsRef = React.createRef();
    this.localVideoRef = React.createRef();
    this.localStreamRef = React.createRef();
    this.sharingVideoRef = {};
    this.selectedVideoRef = React.createRef();
    
    this.state = {
      users: [],
      message: "",
      chat: [],
      isCameraOn: false,
      isMicOn: false,
      isScreenSharingOn: false,
      selectedVideoStream: null,
    };
  }

  sendChat = (event) => {
    event.preventDefault();
    const { message } = this.state;
  
    if (message.trim() !== "") {
      this.setState((prevState) => ({
        chat: [...prevState.chat, { id: "me", message }],
        message: "",
      }));
  
      this.sendChatToPeers(message);
    }
  };
  
  sendChatToPeers = (message) => {
    const { users } = this.state;
  
    users.forEach((user) => {
      const pc = this.pcsRef.current[user.id];
      
    if (pc && pc.connectionState === "connected") {
        console.log("채팅보냄");
        pc.dataChannel.send(JSON.stringify({ type: "chat", message }));
    }
    
      })
    
    this.setState((prevState) => ({
      chat: [...prevState.chat, { message }],
    }));
  };
  toggleCameraAndScreenSharing = () => {
    this.setState((prevState) => ({
      isCameraOn: !prevState.isCameraOn,
      isScreenSharingOn: false, 
    }));
  
    if (this.localStreamRef.current) {
      this.localStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !this.state.isCameraOn;
      });
    }
  };

  getLocalStream = async () => {
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width:  240 ,
          height:  240 ,
        },
      });

      if (!this.state.isCameraOn) {
        localStream.getVideoTracks().forEach((track) => {
          track.enabled = false;
        });
      }
      this.localStreamRef.current = localStream;
      if (this.localVideoRef.current)
        this.localVideoRef.current.srcObject = localStream;
      if (!this.socketRef.current) return;
      this.socketRef.current.emit("join_room", {
        room: "1234",
        email: "sample@naver.com",
      });
    } catch (e) {
      console.log(`getUserMedia error: ${e}`);
    }
  };

  createPeerConnection = (socketID, email) => {
    try {
      const pc = new RTCPeerConnection(this.pc_config);
      
      const dataChannel = pc.createDataChannel("chatChannel");
      dataChannel.onopen = () => console.log("Data channel opened");
      dataChannel.onmessage = (event) => {
        console.log("데이터 채널 메시지 받음:", event.data);
        const data = JSON.parse(event.data);
        if (data.type === "chat") {
          console.log("chat받음");
          this.setState((prevState) => ({
            chat: [...prevState.chat, { id: socketID, message: data.message }],
          }));
        }
        if(data.type === "screenSharingStatus"){
          console.log("screenSharing받음");
          this.setState({ isScreenSharingOn: data.isScreenSharingOn });
        }
      };

      pc.onicecandidate = (e) => {
        if (!(this.socketRef.current && e.candidate)) return;
        this.socketRef.current.emit("candidate", {
          candidate: e.candidate,
          candidateSendID: this.socketRef.current.id,
          candidateReceiveID: socketID,
        });
      };

      pc.oniceconnectionstatechange = (e) => {
        console.log(e);
      };

      pc.ontrack = (e) => {
        if (!this.pcsRef.current) {
          console.error('pcsRef is not defined yet.');
          return;
        }
        this.setState((prevState) => ({
          users: prevState.users
            .filter((user) => user.id !== socketID)
            .concat({
              id: socketID,
              email,
              stream: e.streams[0],
            }),
        }));
        if (e.streams[0].getVideoTracks().length > 0) {
          if (!this.sharingVideoRef[socketID]) {
            this.sharingVideoRef[socketID] = React.createRef();
          }
          if (this.sharingVideoRef[socketID].current) {
            this.sharingVideoRef[socketID].current.srcObject = e.streams[0];
          }}
      };
      
      if (this.localStreamRef.current) {
        console.log("localstream add");
        this.localStreamRef.current.getTracks().forEach((track) => {
          if (!this.localStreamRef.current) return;
          pc.addTrack(track, this.localStreamRef.current);
        });
      } else {
        console.log("no local stream");
      }
      pc.dataChannel = dataChannel;
      return pc;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  };
  
  toggleScreenSharing = () => {
    const displayMediaOptions = {
      video: true,
      audio: false,
    };
  
    if (!this.state.isScreenSharingOn) {
      navigator.mediaDevices
        .getDisplayMedia(displayMediaOptions)
        .then((stream) => {
          const videoTrack = stream.getVideoTracks()[0];
          if (!this.localStreamRef.current) return;
          this.localStreamRef.current
            .getVideoTracks()
            .forEach((track) => track.stop());
          this.localStreamRef.current
            .removeTrack(this.localStreamRef.current.getVideoTracks()[0]);
          this.localStreamRef.current.addTrack(videoTrack);
          if (this.sharingVideoRef.current) {
            this.sharingVideoRef.current.srcObject = stream;
          }

          Object.values(this.pcsRef.current).forEach((pc) => {
            pc.addTrack(videoTrack, this.localStreamRef.current);
          });
  
          this.setState({ isScreenSharingOn: true, isCameraOn: false });
        })
        .catch((error) => {
          console.error("화면 공유 오류:", error);
        });
    } else {
      const videoTrack = this.localStreamRef.current.getVideoTracks()[0];
      if (!videoTrack) return;
      videoTrack.stop();
      this.localStreamRef.current.removeTrack(videoTrack);
  

      Object.values(this.pcsRef.current).forEach((pc) => {
        const sender = pc.getSenders().find((sender) => sender.track === videoTrack);
        if (sender) {
          pc.removeTrack(sender);
        }
      });
  
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          stream.getTracks().forEach((track) => {
            if (!this.localStreamRef.current) return;
            this.localStreamRef.current.addTrack(track);
  
            Object.values(this.pcsRef.current).forEach((pc) => {
              pc.addTrack(track, this.localStreamRef.current);
            });
          });
  
          this.setState({ isScreenSharingOn: false, isCameraOn: true });
        })
        .catch((error) => {
          console.error("로컬 스트림 가져오기 오류:", error);
        });
    }
    this.renegotiate();
  };
  
  sendScreenSharingStatusToPeers = (isScreenSharingOn) => {
    const { users } = this.state;
  
    users.forEach((user) => {
      const pc = this.pcsRef.current[user.id];
      if (pc && pc.connectionState === "connected") {
        console.log("화면공유 보냄");
        pc.dataChannel.send(
          
          JSON.stringify({
            type: "screenSharingStatus",
            isScreenSharingOn,
          })
        );
      }
    });
  };

  componentDidMount() {
    this.socketRef.current = io.connect(this.SOCKET_SERVER_URL);
    this.getLocalStream();

    // 상대방에게 Offer를 받는 부분
this.socketRef.current.on('sendOfferToPeer', async (data) => {
  const { offer, senderID } = data;

  // 상대방의 Peer Connection 생성 및 설정
  const pc = this.createPeerConnection(senderID, 'someEmail');
  this.pcsRef.current = { ...this.pcsRef.current, [senderID]: pc };

  await pc.setRemoteDescription(new RTCSessionDescription(offer));

  // Answer 생성 및 전송
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(new RTCSessionDescription(answer));

  this.socketRef.current.emit('sendAnswerToPeer', {
    answer,
    senderID: this.socketRef.current.id,
    receiverID: senderID,
  });
  });
  // 상대방에게 Answer를 받는 부분
this.socketRef.current.on('sendAnswerToPeer', async (data) => {
  const { answer, senderID } = data;

  // 상대방의 Peer Connection에서 Remote Description 설정
  const pc = this.pcsRef.current[senderID];
  if (pc) {
    await pc.setRemoteDescription(new RTCSessionDescription(answer));
  }
  });


    this.socketRef.current.on("chat message", (data) => {
      const { id, message } = data;
      this.setState((prevState) => ({
        chat: [...prevState.chat, { id, message }],
      }));
    });
    this.socketRef.current.on("all_users", (allUsers) => {
      allUsers.forEach(async (user) => {
        if (!this.localStreamRef.current) return;
        const pc = this.createPeerConnection(user.id, user.email);
        if (!(pc && this.socketRef.current)) return;
        this.pcsRef.current = { ...this.pcsRef.current, [user.id]: pc };
        try {
          const localSdp = await pc.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true,
          });
          console.log("create offer success");
          await pc.setLocalDescription(new RTCSessionDescription(localSdp));
          this.socketRef.current.emit("offer", {
            sdp: localSdp,
            offerSendID: this.socketRef.current.id,
            offerSendEmail: "name",
            offerReceiveID: user.id,
          });
        } catch (e) {
          console.error(e);
        }
      });
    });

    this.socketRef.current.on(
      "getOffer",
      async (data) => {
        const { sdp, offerSendID, offerSendEmail } = data;
        console.log("get offer");
        const pc = this.createPeerConnection(offerSendID, offerSendEmail);
        if (!(pc && this.socketRef.current)) return;
        this.pcsRef.current = { ...this.pcsRef.current, [offerSendID]: pc };
        try {
          console.log(
            "Before setting remote description, signaling state is: ",
            pc.signalingState
          );
          await pc.setRemoteDescription(new RTCSessionDescription(sdp));
          console.log("set remote description success");
          const localSdp = await pc.createAnswer({
            offerToReceiveVideo: true,
            offerToReceiveAudio: true,
          });
          await pc.setLocalDescription(new RTCSessionDescription(localSdp));
          this.socketRef.current.emit("answer", {
            sdp: localSdp,
            answerSendID: this.socketRef.current.id,
            answerReceiveID: offerSendID,
          });
        } catch (e) {
          console.error(e);
        }
      }
    );

    this.socketRef.current.on("getAnswer", async (data) => {
      const { sdp, answerSendID } = data;
      console.log("get answer");
      const pc = this.pcsRef.current[answerSendID];
      if (!pc) return;
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
        console.log("set remote description success");
      } catch (e) {
        console.error(e);
      }
    });
    
    this.socketRef.current.on(
      "getCandidate",
      async (data) => {
        console.log("get candidate");
        const pc = this.pcsRef.current[data.candidateSendID];
        if (!pc) return;
        await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        console.log("candidate add success");
      }
    );

    this.socketRef.current.on("user_exit", (data) => {
      if (!this.pcsRef.current[data.id]) return;
      this.pcsRef.current[data.id].close();
      delete this.pcsRef.current[data.id];
      this.setState((prevState) => ({
        users: prevState.users.filter((user) => user.id !== data.id),
      }));
    });
  }

  toggleCamera = () => {
    this.setState((prevState) => ({
      isCameraOn: !prevState.isCameraOn,
    }));

    if (this.localStreamRef.current) {
      this.localStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !this.state.isCameraOn;
      });

    }
    this.renegotiate();
  };
  async renegotiate() {
    Object.values(this.pcsRef.current).forEach(async (pc) => {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
    
      
      this.socketRef.current.emit('sendOfferToPeer', {
        offer,
        senderID: this.socketRef.current.id,
        
      });
    });
  }
  
  toggleMicrophone = () => {
    this.setState((prevState) => ({
      isMicOn: !prevState.isMicOn,
    }));

    if (this.localStreamRef.current) {
      this.localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !this.state.isMicOn;
      });
    }
  };
  handleVideoClick = (stream) => {
    this.setState({
      selectedVideoStream: stream,
    });
    if (this.selectedVideoRef.current) {
      this.selectedVideoRef.current.srcObject = stream;
    }
  };
  

  render() {
    const {
      users,
      message,
      chat,
      isCameraOn,
      selectedVideoStream,
      isMicOn,
      isScreenSharingOn

    } = this.state;

    return (
      <div className="p2p-container">
    
        <div className="mid">
          <div className="videos">
            {this.localStreamRef.current ? (


              <div id="MyVideoBox">
                {isCameraOn ? (
                <video
                className="local-video"
                muted
                ref={this.localVideoRef}
                onClick={() => this.handleVideoClick(this.localStreamRef.current)}
                autoPlay
              ></video>
                
              ) : (
                <video
                className="local-video"
                muted
                ref={this.localVideoRef}
                onClick={() => this.handleVideoClick(this.localStreamRef.current)}
                autoPlay
              ></video>
              )}
                
                <button className="videoBtn" onClick={this.toggleCamera}>
                  {isCameraOn ? (
                    <FontAwesomeIcon className="Icon" icon={faVideo} />
                  ) : (
                    <FontAwesomeIcon className="Icon" icon={faVideoSlash} />
                  )}
                </button>
                <button className="micBtn" onClick={this.toggleMicrophone}>
                  {isMicOn ? (
                    <FontAwesomeIcon className="Icon" icon={faMicrophone} />
                  ) : (
                    <FontAwesomeIcon
                      className="Icon"
                      icon={faMicrophoneSlash}
                    />
                  )}

                </button>
                <button onClick={this.toggleScreenSharing}>
                  {this.state.isScreenSharingOn ? "화면 공유 끄기" : "화면 공유 켜기"}
                </button>
              </div>
            ) : (
              <div id="MyVideoBox">

                <video
                className="local-video"
                muted
                ref={this.localVideoRef}
                onClick={() => this.handleVideoClick(this.localStreamRef.current)}
                autoPlay
              ></video>

                <button className="videoBtn" onClick={this.toggleCamera}>
                  {isCameraOn ? (
                    <FontAwesomeIcon className="Icon" icon={faVideo} />
                  ) : (
                    <FontAwesomeIcon className="Icon" icon={faVideoSlash} />
                  )}
                </button>
                <button className="micBtn" onClick={this.toggleMicrophone}>
                  {isMicOn ? (
                    <FontAwesomeIcon className="Icon" icon={faMicrophone} />
                  ) : (
                    <FontAwesomeIcon
                      className="Icon"
                      icon={faMicrophoneSlash}
                    />
                  )}
                </button>
                <button onClick={this.toggleScreenSharing}>
                  {this.state.isScreenSharingOn ? "화면 공유 끄기" : "화면 공유 켜기"}
                </button>
              </div>
            )}
            <div className="remote-videos">
              {users.map((user, index) => {
                return user.stream.getVideoTracks ? (

                  <div className="remote-video" key={index}>
                    
                  <Video key={index} stream={user.stream} id={user.id}
                   onClick={() => this.handleVideoClick(user.stream)} />
                  </div>

                ) : (
                  <FontAwesomeIcon className="local-video" icon={faUser} />
                  );
                })}
              </div>
            </div>

            
            <div className="sharing-video-container">
            {this.state.selectedVideoStream && (
               <video
               className="sharing-video"
               ref={this.selectedVideoRef}
               
               autoPlay
             ></video>
            )}
              </div>
            
          </div>
          <div className="chat-container">
              <div className="chat-messages">
                {chat.map((messageObj, index) => (
                  <div key={index}>{messageObj.message}</div>

                ))}
              </div>
              <form onSubmit={this.sendChat}>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => this.setState({ message: e.target.value })}
                />
                <button type="submit">Send</button>
              </form>
            </div>

          <div className="bottom"></div>
        </div>
      );
    }
    }
    
    export default Meeting;
    
