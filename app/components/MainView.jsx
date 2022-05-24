import React from "react";
import { Signup } from "./SingUp";
import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { SOLANA_HOST } from "../utils/const";
import { getProgramInstance } from "../utils/utils";
import Video from './video'
import BottomBar from './BottomBar'
import style from '../styles/MainView.module.css'
import useAccount from "../hooks/useAccount";
import useTiktok from "../hooks/useTiktok";
const anchor = require("@project-serum/anchor");
const utf8 = anchor.utils.bytes.utf8;

export default function MainView() {
  const [isAccount, setAccount] = useState(false);
  const [tiktoks, setTikToks] = useState([]);
  const [newVideoShow, setNewVideoShow] = useState(false);
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [userDetail, setUserDetail] = useState()

  const wallet = useWallet();
  const connection = new anchor.web3.Connection(SOLANA_HOST);

  const program = getProgramInstance(connection, wallet);
  const { signup } = useAccount();
  const { getTiktoks, likeVideo, createComment, newVideo, getComments } =
    useTiktok(
      setTikToks,
      userDetail,
      videoUrl,
      description,
      setDescription,
      setVideoUrl,
      setNewVideoShow
    );

  useEffect(() => {
    if (wallet.connected) {
      checkAccount();
      getTiktoks();
    }
  }, [wallet.connected]);

  const checkAccount = async () => {
    let [user_pda] = await anchor.web3.PublicKey.findProgramAddress(
      [utf8.encode("user"), wallet.publicKey.toBuffer()],
      program.programId
    );

    try {
      const userAll = await program.account.userAccount.all();
      const userInfo = await program.account.userAccount.fetch(user_pda);
      console.log(userInfo);
      setUserDetail(userInfo)
      setAccount(true);
    } catch (e) {
      console.log(e)
      setAccount(false);
    }
  };

  return (
    <>
      {isAccount ? (
        <div>
          <div className={style.appVideos}>
            {tiktoks.length === 0 ? (
              <h1> No Videos </h1>
            ) : (
              tiktoks.map((tiktok, id) => (
                <Video
                  key={id}
                  url={tiktok.account.videoUrl}
                  channel={tiktok.account.creatorName}
                  index={tiktok.account.index.toNumber()}
                  likes={tiktok.account.likes}
                  description={tiktok.account.description}
                  shares={tiktok.account.remove.toNumber()}
                  likeVideo={likeVideo}
                  likesAddress={tiktok.account.peopleWhoLiked}
                  createComment={createComment}
                  getComments={getComments}
                  commentCount={tiktok.account.commentCount.toNumber()}
                />
              ))
            )}
          </div>
          <BottomBar
            setNewVideoShow={setNewVideoShow}
            getTiktoks={getTiktoks}
          />
        </div>
      ) : (
        <Signup signup={signup} wallet={wallet.publicKey.toBase58()} />
      )}
    </>
  );
}
