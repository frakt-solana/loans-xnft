import React, { useEffect, useState } from "react";
import ReactXnft, { Button, Image, Loading, Text, usePublicKey, View } from "react-xnft";
import { sum, map, filter } from 'ramda';
import { fetchBulkSuggestion } from "./api/nft";
import { proposeBulkLoan } from "./utils/proposeBulkLoan";


const getTotalValue = (bulk): number => {
    const priceBased = (nft) => nft?.isPriceBased;
    const timeBased = (nft) => !nft?.isPriceBased;
    const maxLoanValue = ({ maxLoanValue }) => maxLoanValue;
    const suggestedLoanValue = (nft) =>
        nft?.priceBased.suggestedLoanValue;

    const priceBasedLoans = filter(priceBased, bulk);
    const timeBasedLoans = filter(timeBased, bulk);

    const priceBasedLoansValue =
        sum(map(suggestedLoanValue, priceBasedLoans)) || 0;

    const timeBasedLoansValue = sum(map(maxLoanValue, timeBasedLoans)) || 0;

    return priceBasedLoansValue + timeBasedLoansValue;
};

export const badgesInfo = {
    best: {
        title: 'Best',
        text: 'Most appropriate to chosen SOL amount',
        color: '#9cff1f',
    },
    cheapest: {
        title: 'Cheapest',
        text: 'Minimal fees paid',
        color: '#fff61f',
    },
    safest: {
        title: 'Safest',
        text: 'Loans with lowest loan to value ratio',
        color: '#1fc9ff',
    },
};


const Suggestions = ({ solAmount }) => {
    const [loading, setLoading] = useState(false);
    const [bulks, setBulks] = useState<any>()
    const publicKey = usePublicKey();

    useEffect(() => {
        setLoading(true);
        (async () => {
            const result = await fetchBulkSuggestion({
                publicKey,
                totalValue: solAmount
            });

            setBulks(result);

            console.log({ result })
        })();
        setLoading(false);
    }, [solAmount, publicKey])

    const bestBulk = bulks?.best ?? [];
    const cheapestBulk = bulks?.cheapest ?? [];
    const safestBulk = bulks?.safest ?? [];
    const maxBulk = bulks?.max ?? [];

    const bestBulkValue = getTotalValue(bestBulk);
    const cheapestBulkValue = getTotalValue(cheapestBulk);
    const safestBulkValue = getTotalValue(safestBulk);
    const maxBulkValue = getTotalValue(maxBulk);

    const isBulkExist = !!bestBulk?.length || !!maxBulk?.length;

    const onBorrow = async (type) => {
        try {
            setLoading(true);

            const result = await proposeBulkLoan({
                wallet,
                connection,
                selectedBulk: bulks.find((bulk) => bulk.type === type),
            });

            if (!result) {
                throw new Error('Loan proposing failed');
            }

            showConfetti();
            setSelectedBulk([]);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    const getBulkValues = (
        bulk,
        value: number,
        type: string,
    ) => {
        if (!bulk.length) return;

        const { color, title, text } = badgesInfo[type];
        console.log({ badgesInfo, type })
        return (
            <View style={{ width: '80%', border: `1px solid ${color}`, gap: '10px', display: 'flex', flexDirection: 'column', borderRadius: "0.75rem", padding: '10px' }}>
                <View>
                    <View style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text style={{ color: color }}>
                            {title}
                        </Text>
                        <Text style={{ fontSize: '12px', opacity: '0.5' }}>Borrowing {value.toFixed(2)}◎</Text>
                    </View>

                    <View style={{ display: 'flex', gap: '10px', overflow: 'hidden' }} >
                        {(bulk || []).map(({ imageUrl }) => (
                            <Image key={imageUrl} src={imageUrl} style={{ width: '50px', height: '50px' }} />
                        ))}
                    </View>
                </View>
                <View style={{ display: 'flex', justifyContent: "center" }}>
                    <Button
                        style={{
                            backgroundColor: color,
                            color: "black", width: '100%'
                        }}
                        onClick={() => onBorrow(type)}
                    >
                        Borrow
                    </Button>
                </View>

            </View>
        );
    };

    if (loading) {
        return <View>
            <Loading />
        </View>
    }

    return <View style={{ gap: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

        {getBulkValues(bestBulk, bestBulkValue, 'best')}
        {getBulkValues(cheapestBulk, cheapestBulkValue, 'cheapest')}
        {getBulkValues(safestBulk, safestBulkValue, 'safest')}
        {getBulkValues(maxBulk, maxBulkValue, 'best')}

    </View>
}

export default Suggestions;