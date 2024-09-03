import React from "react";
import "./ExploreList.css";
import ExploreCard from "../exploreCard/ExploreCard";
import ExploreCardSkeleton from "../exploreCard/ExploreCardSkeleton";
import { useGetMyplaylistInfoQuery } from "../../reduxtool/services/myApi";
import { useGetPlaylistQuery } from "../../reduxtool/services/songsApi";
import { useSelector } from "react-redux";

const ExploreList = ({ playlistId, serverType }) => {
  const currentSong = useSelector(
    (state) => state.currentSongSlice.currentSongInfo
  );
  const { miniPlayerActive } = currentSong;

  const isMiniPlayerActive = miniPlayerActive ?? false;

  const { data, isLoading } =
    serverType === "myServer"
      ? useGetMyplaylistInfoQuery({ skip: !miniPlayerActive })
      : useGetPlaylistQuery(playlistId, {
          skip: !isMiniPlayerActive,
        });

  return (
    <div className="explore-list-container">
      {serverType === "myServer" ? (
        !isLoading && data.localPlaylistsInfo.length ? (
          data.localPlaylistsInfo?.map((playlist, index) => (
            <div key={index} className="explore-card-wrapper">
              <h1>{playlist?.playlistTitle}</h1>
              <div className="explore-card-list">
                {playlist.data.map((item) => (
                  <ExploreCard
                    key={item.playlistId}
                    playlistId={item.playlistId}
                    title={item.title}
                    poster={item.poster}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <ExploreCardSkeleton amount={5} />
        )
      ) : (
        <>
          <div className="explore-card-list">
            {!isLoading && data.items.length ? (
              data.items?.map((item) => (
                <ExploreCard
                  key={item.id}
                  playlistId={item.id}
                  title={item.snippet.title}
                  poster={item.snippet.thumbnails.standard.url}
                  description={item.snippet.description}
                />
              ))
            ) : (
              <ExploreCardSkeleton amount={5} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ExploreList;
