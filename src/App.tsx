import React, { useEffect, useState } from "react";
import ReactXnft, { Button, Loading, Stack, Text, TextField, useConnection, useNavigation, usePublicKey, View } from "react-xnft";
import { sum, map } from 'ramda';
import { fetchWalletBorrowNfts } from "./api/nft";
import { Frakt } from "./iconsNew/Frakt";
import { Logo } from "./iconsNew/Logo";
import Home from "./Home";
import Suggestions from "./Suggestions";


//
// On connection to the host environment, warm the cache.
//
ReactXnft.events.on("connect", () => {
  // no-op
});

export function App() {
  const publicKey = usePublicKey();
  const connection = useConnection();
  // const nav = useNavigation();
  const [availableBorrowValue, setAvailableBorrowValue] = useState<number | undefined>(undefined);
  const [requestedBorrowValue, setRequestedBorrowValue] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const maxLoanValue = ({ maxLoanValue }) => maxLoanValue;

  useEffect(() => {
    setLoading(true);
    (async () => {
      const walletNfts = await fetchWalletBorrowNfts({
        publicKey,
        limit: 1000,
        offset: 0,
      });

      const availableBorrowValue =
        sum(map(maxLoanValue, walletNfts)) || null;

      setAvailableBorrowValue(availableBorrowValue);
      setRequestedBorrowValue(availableBorrowValue);
    })();
    setLoading(false);
  }, [publicKey]);

  const onMax = () => {
    setRequestedBorrowValue(availableBorrowValue)
  }

  const onChangeRequestedBorrow = (ev) => {
    const value = ev.target.value;
    console.log(value)
    try {
      setRequestedBorrowValue(value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1'))
      // setRequestedBorrowValue(parseFloat(value) || 0)
    } catch (error) {
      setRequestedBorrowValue(undefined)
    }
  }

  const disabled = !requestedBorrowValue || requestedBorrowValue > availableBorrowValue;

  // const onBorrow = () => {
  //   if (!disabled) {

  //     nav.push("suggestions", {});
  //   }
  // }

  if (loading) {
    return <View>
      <Loading></Loading>
    </View>
  }

  return (
    <Stack.Navigator
      initialRoute={{ name: "home" }}
      options={({ route }) => {
        switch (route.name) {
          case "home":
            return {
              title: <View style={{ display: "flex", justifyContent: "center" }}>
                <Frakt />
              </View>,
            };
          case "suggestions":
            return { title: <Text>Select option</Text> };

          default:
            throw new Error("unknown route");
        }
      }}
      style={{}}
    >
      <Stack.Screen
        name={"home"}
        component={() => <Home />}
      />
      <Stack.Screen name={"suggestions"} component={Suggestions}>
      </Stack.Screen>
    </Stack.Navigator>
  );
}
