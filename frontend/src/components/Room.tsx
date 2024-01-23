import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Socket, io } from "socket.io-client";

export const Room = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [lobby, setLobby] = useState(true);
  const [socket, setSocket] = useState<null | Socket>(null);
  const [sendingPc, setSendingPc] = useState<null | RTCPeerConnection>(null);
  const [receivingPc, setReceivingPc] = useState<null | RTCPeerConnection>(
    null
  );
  const [remoteVideoTrack, setRemoteVideoTrack] =
    useState<MediaStreamTrack | null>(null);
  const [remoteAudioTrack, setRemoteAudioTrack] =
    useState<MediaStreamTrack | null>(null);
  const [remoteMediaStream, setRemoteMediaStream] =
    useState<MediaStream | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>();
  const localVideoRef = useRef<HTMLVideoElement>();
  useEffect(() => {}, []);

  return <div>Room</div>;
};
