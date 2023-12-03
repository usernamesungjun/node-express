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
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    };
    this.SOCKET_SERVER_URL = "http://localhost:3030";

    this.socketRef = React.createRef();
    this.pcsRef = React.createRef();
    this.localVideoRef = React.createRef();
    this.localStreamRef = React.createRef();
    this.sharingVideoRef = React.createRef();
    
    this.state = {
      users: [],
      message: "",
      chat: [],
      isCameraOn: false,
      isMicOn: false,
      isScreenSharingOn: false
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
  
      // 모든 피어에게 채팅 메시지 전송
      this.sendChatToPeers(message);
    }
  };
  
  // 피어에게 채팅 메시지를 직접 전송하는 함수
  sendChatToPeers = (message) => {
    const { users } = this.state;
  
    // 시그널링 서버를 통해 피어에게 채팅 메시지를 전송
    users.forEach((user) => {
      const pc = this.pcsRef.current[user.id];
      if (pc && pc.connectionState === "connected") {
        pc.dataChannel.send(JSON.stringify({ type: "chat", message }));
      }
    });
  };
  toggleCameraAndScreenSharing = () => {
    this.setState((prevState) => ({
      isCameraOn: !prevState.isCameraOn,
      isScreenSharingOn: false, // 화면 공유 상태 끄기
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
          width: 240,
          height: 240,
        },
      });

      console.log("스트림 성공");
      this.localStreamRef.current = localStream;
      if (this.localVideoRef.current)
        this.localVideoRef.current.srcObject = localStream;
      if (!this.socketRef.current) return;
      this.socketRef.current.emit("join_room", {
        room: "1234",
        email: "sample@naver.com",
      });
    } catch (e) {
      console.log("localStreamRef", this.localStreamRef.current);
      console.log(`getUserMedia error: ${e}`);
    }
  };

  createPeerConnection = (socketID, email) => {
    try {
      const pc = new RTCPeerConnection(this.pc_config);
      
      const dataChannel = pc.createDataChannel("chatChannel");
      dataChannel.onopen = () => console.log("Data channel opened");
      dataChannel.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "chat") {
          // 받은 채팅 메시지 처리
          this.setState((prevState) => ({
            chat: [...prevState.chat, { id: socketID, message: data.message }],
          }));
        }
      };

      pc.onicecandidate = (e) => {
        if (!(this.socketRef.current && e.candidate)) return;
        console.log("onicecandidate");
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
        console.log("ontrack success");
        this.setState((prevState) => ({
          users: prevState.users
            .filter((user) => user.id !== socketID)
            .concat({
              id: socketID,
              email,
              stream: e.streams[0],
            }),
        }));
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

      return pc;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  };
  
  toggleScreenSharing = () => {
    this.setState((prevState) => ({
      isScreenSharingOn: !prevState.isScreenSharingOn,
      isCameraOn: false, // 카메라 상태 끄기
    }));
  
    // 화면 공유 트랙을 추가 또는 제거합니다.
    if (this.localStreamRef.current) {
      const displayMediaOptions = {
        video: true,
        audio: false,
      };
  
      if (this.state.isScreenSharingOn) {
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
          if(this.sharingVideoRef.current){
            this.sharingVideoRef.current.srcObject = stream
          }
          })
          .catch((error) => {
            console.error("화면 공유 오류:", error);
          });
      } else {
        const videoTrack = this.localStreamRef.current.getVideoTracks()[0];
        if (!videoTrack) return;
        videoTrack.stop();
        this.localStreamRef.current.removeTrack(videoTrack);
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            stream.getTracks().forEach((track) => {
              if (!this.localStreamRef.current) return;
              this.localStreamRef.current.addTrack(track);
            });
          })
          .catch((error) => {
            console.error("로컬 스트림 가져오기 오류:", error);
          });
      }
    }
  };


  
  // 피어에게 화면 공유 상태를 알리는 함수
  sendScreenSharingStatusToPeers = (isScreenSharingOn) => {
    const { users } = this.state;
  
    // 모든 피어에게 화면 공유 상태를 전송
    users.forEach((user) => {
      const pc = this.pcsRef.current[user.id];
      if (pc && pc.connectionState === "connected") {
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
  };

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

  render() {
    const {
      users,
      message,
      chat,
      isCameraOn,

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
                autoPlay
              ></video>
                
              ) : (
                <video
                className="local-video"
                muted
                ref={this.localVideoRef}
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

                  <div className="remote-video">
                  <Video key={index} stream={user.stream} id={user.id} />
                  </div>

                ) : (
                  <FontAwesomeIcon className="local-video" icon={faUser} />
                  );
                })}
              </div>
            </div>

            
            <div className="sharing-video-container">
            <video className="sharing-video" ref={this.sharingVideoRef} autoPlay></video>
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
    
