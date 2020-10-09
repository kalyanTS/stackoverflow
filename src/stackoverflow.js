import React, { useState, useEffect } from "react";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonModal,
} from "@ionic/react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";

let pageNo = 1;

const QuestionCard = ({ data, index, setModalStatus }) => {
  return (
    <div onClick={() => setModalStatus(index)} style={{ cursor: "pointer" }}>
      <IonCard style={{ minHeight: "100px" }}>
        <IonCardContent>
          <IonGrid>
            <IonRow>
              <IonCol size='1'>
                <h3>{data.answer_count} answers</h3>
              </IonCol>
              <IonCol size='8'>
                <h2>{data.title}</h2>
              </IonCol>

              <img
                src={data.owner.profile_image}
                style={{ width: "30px", height: "30px" }}
              />

              <h3 style={{ marginLeft: "10px" }}>{data.owner.display_name}</h3>
            </IonRow>
            <IonRow>
              <IonCol size='1'>
                <h3>{data.view_count} views</h3>
              </IonCol>
              <IonCol size='11'>
                {data.tags.map((v, i) => (
                  <IonButton size='small'>{v}</IonButton>
                ))}
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCardContent>
      </IonCard>
    </div>
  );
};

const StackOverflow = () => {
  const [state, setState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalStatus, setModalStatus] = useState(null);

  useEffect(() => {
    axios
      .get(
        "https://api.stackexchange.com/2.2/questions?order=desc&page=" +
          pageNo +
          "&sort=hot&site=stackoverflow"
      )
      .then((res) => {
        console.log(res.data);
        setState(res.data.items);
        setLoading(false);
        pageNo++;
      });
  }, []);

  const fetchData = () => {
    axios
      .get(
        "https://api.stackexchange.com/2.2/questions?order=desc&page=" +
          pageNo +
          "&sort=hot&site=stackoverflow"
      )
      .then((res) => {
        let newData = res.data.items;
        let temp = [...state, ...newData];
        console.log(temp);
        setState(temp);
        pageNo++;
      });
  };

  const refresh = () => {};

  const getDate = (date) => {
    let result = new Date(date);
    result = result.toString();
    return result;
  };

  return loading ? null : (
    <React.Fragment>
      <IonModal
        isOpen={modalStatus != null}
        onDidDismiss={() => setModalStatus(null)}>
        {modalStatus != null ? (
          <IonGrid>
            <IonButton
              fill='outline'
              style={{ float: "right" }}
              onClick={() => setModalStatus(null)}>
              X
            </IonButton>
            <IonRow>
              <h4>Question:</h4>
              <h4 style={{ fontWeight: "normal", marginLeft: "5px" }}>
                {state[modalStatus].title}
              </h4>
            </IonRow>
            <IonRow>
              <h4>Link to the question:</h4>
              <h4>
                <a
                  href={state[modalStatus].link}
                  target='_blank'
                  rel='noopener noreferrer'
                  style={{ textDecoration: "none", marginLeft: "5px" }}>
                  Link
                </a>
              </h4>
            </IonRow>
            <IonRow>
              <h4>Tags:</h4>
              <h4 style={{ fontWeight: "normal", marginLeft: "5px" }}>
                {state[modalStatus].tags.map((tag) => tag + ", ")}
              </h4>
            </IonRow>
            <IonRow>
              <h4>Author:</h4>
              <h4 style={{ fontWeight: "normal", marginLeft: "5px" }}>
                {state[modalStatus].owner.display_name}
              </h4>
            </IonRow>
            <IonRow>
              <h4>Answers:</h4>
              <h4 style={{ fontWeight: "normal", marginLeft: "5px" }}>
                {state[modalStatus].answer_count}
              </h4>
            </IonRow>
            <IonRow>
              <h4>Views:</h4>
              <h4 style={{ fontWeight: "normal", marginLeft: "5px" }}>
                {state[modalStatus].view_count}
              </h4>
            </IonRow>

            <IonRow>
              <h4>Created on:</h4>
              <h4 style={{ fontWeight: "normal", marginLeft: "5px" }}>
                {getDate(state[modalStatus].creation_date)}
              </h4>
            </IonRow>

            <IonRow>
              <h4>Last activity on:</h4>
              <h4 style={{ fontWeight: "normal", marginLeft: "5px" }}>
                {getDate(state[modalStatus].last_activity_date)}
              </h4>
            </IonRow>

            <IonRow>
              <h4>Last edited on:</h4>
              <h4 style={{ fontWeight: "normal", marginLeft: "5px" }}>
                {getDate(state[modalStatus].last_edit_date)}
              </h4>
            </IonRow>
          </IonGrid>
        ) : null}
      </IonModal>
      <InfiniteScroll
        dataLength={state.length} //This is important field to render the next data
        next={fetchData}
        hasMore={true}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
        // below props only if you need pull down functionality
        refreshFunction={refresh}
        pullDownToRefresh
        pullDownToRefreshThreshold={50}
        pullDownToRefreshContent={
          <h3 style={{ textAlign: "center" }}>&#8595; Pull down to refresh</h3>
        }
        releaseToRefreshContent={
          <h3 style={{ textAlign: "center" }}>&#8593; Release to refresh</h3>
        }>
        {state.map((question, i) => {
          return (
            <QuestionCard
              data={question}
              index={i}
              setModalStatus={setModalStatus}
            />
          );
        })}
      </InfiniteScroll>
    </React.Fragment>
  );
};

export default StackOverflow;
