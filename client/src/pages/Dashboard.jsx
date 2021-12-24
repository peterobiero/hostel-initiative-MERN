import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import styled from "styled-components";
import Manage from "./Manage";
import Account from "./Account";
import firebase from "firebase";
import DashboardHome from "./DashboardHome";
import { Routes, Route, useNavigate } from "react-router-dom";
import { database } from "../config";
import { dispatchUser, dispatchUserToken } from "../redux/userSlice";
import {
  dispatchAccomodations,
  dispatchAllAccomodations,
} from "../redux/accomodationsSlice";
import { useDispatch, useSelector } from "react-redux";
import Signin from "../pages/Signin";
import axios from "axios";
const Section = styled.section`
  background: #fcfcfc;
`;

const Flex = styled.div`
  display: flex;
`;
const Right = styled.div`
  width: 100%;
`;

const Dashboard = () => {
  const dispatch = useDispatch();
  const isLogged = useSelector((state) => state.user.isLogged);
  console.log(isLogged);
  const [authState, setAuthState] = useState("");
  const navigate = useNavigate();
  const [userUid, setUserUid] = useState(null);
  const [profilesCheck, setProfilesCheck] = useState(null);
  //snapshots
  const [profiles, setProfiles] = useState([]);
  //spinner
  const [loading, setLoading] = useState(true);

  const [filterQuery, setFilterQuery] = useState("");

  useEffect(() => {
    const firstLogin = localStorage.getItem("firstLogin");

    if (firstLogin) {
      try {
        const getToken = async () => {
          const response = await axios.get("/api/users/refresh_token");
          console.log(response.data);
          dispatch(dispatchUserToken(response.data.access_token));
        };
        getToken();
      } catch (error) {
        console.log(error.message);
      }
    }
  }, [dispatch]);

  useEffect(() => {
    const getAllAccomodations = async () => {
      try {
        const response = await axios.get("/api/accomodations");
        dispatch(dispatchAllAccomodations(response.data.message));
      } catch (error) {
        console.log(error.message);
      }
    };
    getAllAccomodations();
  }, [dispatch]);

  // useEffect(() => {
  //   firebase.auth().onAuthStateChanged(function (user) {
  //     if (!user) {
  //       setAuthState(false);
  //     } else {
  //       setAuthState(true);
  //       setUserUid(user.uid);
  //     }
  //   });
  // }, []);

  // useEffect(() => {
  //   database.ref("users/" + userUid).on("value", (snapshot) => {});
  // }, [userUid]);

  // useEffect(() => {
  //   const getUser = async () => {
  //     if (userUid) {
  //       await database
  //         .ref()
  //         .child("users")
  //         .child(userUid)
  //         .get()
  //         .then((snapshot) => {
  //           if (snapshot.exists()) {
  //             dispatch(dispatchUser(snapshot.val()));
  //           } else {
  //             console.log("No data available");
  //           }
  //         })
  //         .catch((error) => {
  //           console.error(error);
  //         });
  //     }
  //   };
  //   getUser();
  // }, [userUid, dispatch]);

  // useEffect(() => {
  //   const getAccomodationsForSpecificUser = async () => {
  //     if (userUid) {
  //       await database
  //         .ref(`accomodations/${userUid}`)
  //         .on("value", (snapshot) => {
  //           if (snapshot.exists()) {
  //             let returnArr = [];

  //             snapshot.forEach((childSnapshot) => {
  //               let item = childSnapshot.val();
  //               returnArr.push(item);
  //             });
  //             console.log(returnArr);
  //             dispatch(dispatchAccomodations(returnArr));
  //           } else {
  //             console.log("No data available");
  //           }
  //         });
  //     }
  //   };
  //   getAccomodationsForSpecificUser();
  // }, [userUid, dispatch]);

  return (
    <Section>
      <Flex>
        <Sidebar />
        <Right>
          <Routes>
            <Route
              path="/"
              element={isLogged === true ? <DashboardHome /> : <Signin />}
            />
            <Route
              path="/manage"
              element={isLogged === true ? <Manage /> : <Signin />}
            />
            <Route
              path="/account"
              element={isLogged === true ? <Account /> : <Signin />}
            />
          </Routes>
        </Right>
      </Flex>
    </Section>
  );
};

export default Dashboard;
