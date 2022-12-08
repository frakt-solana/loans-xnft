import React, { useEffect, useState } from "react";
import ReactXnft, { Button, Loading, Stack, Text, TextField, useConnection, useNavigation, usePublicKey, View } from "react-xnft";
import { sum, map } from 'ramda';
import { fetchWalletBorrowNfts } from "./api/nft";


const Home = () => {

    const publicKey = usePublicKey();
    const connection = useConnection();
    const nav = useNavigation();
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

    const disabled = !requestedBorrowValue || requestedBorrowValue > (availableBorrowValue || 0);

    const onBorrow = () => {
        if (!disabled) {

            nav.push("suggestions", { solAmount: requestedBorrowValue });
        }
    }

    if (loading) {
        return <View>
            <Loading></Loading>
        </View>
    }
    return <View style={{
        display: 'flex',
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "60px",
        gap: "15px"
    }}>

        <View>
            <Text>Borrow up tp {availableBorrowValue}◎ with your NFTs!</Text>
        </View>
        <View style={{ position: "relative" }}>
            <TextField style={{ width: '100%' }} placeholder={availableBorrowValue?.toString()} value={requestedBorrowValue?.toString()} onChange={onChangeRequestedBorrow}></TextField>
            <Button onClick={onMax} style={{ background: "transparent", position: "absolute", right: 0, top: "5px", bottom: "5px" }}>MAX</Button>
        </View>
        <View>
            <Button style={{
                opacity: disabled ? '0.5' : '1',
                backgroundColor: "#9cff1f",
                color: "black"
            }}
                onClick={onBorrow}>Borrow</Button>
        </View>
    </View>
}

export default Home;