import React, { useState } from 'react';
import { Box, Text, Image, Link } from '@chakra-ui/react';
import LikeButtonSmall from '../LikeButtonSmall/LikeButtonSmall';
import { Address } from '../Map/Map';
import axios from 'axios';

interface Event {
    _id: string;
    creator: string;
    date: string;
    address: Address;
    topic: string;
    category: string[];
    joinedBy: string[];
    savedBy: string[];
    membersAmount: number;
    budget: number;
    imageURL: string;
}

interface EventItemProps {
    event: Event;
    imageUrl: string;
}

const formattedDate = (dateString: string): string => {
    const date = new Date(dateString);
    const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
};

const EventItem: React.FC<EventItemProps> = ({ event, imageUrl }) => {
    const { _id, date, topic, savedBy } = event;
    const [showDetails, setShowDetails] = useState(false);
    const [isLiked, setIsLiked] = useState<boolean>(savedBy.includes(localStorage.getItem("userId") || ''));
    const formattedDateString = formattedDate(date);

    const [humanAddress, setHumanAddress] = useState("");

    async function getAddressByCoordinates(coordinates: Array<number>) {
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${coordinates[1]}&lon=${coordinates[0]}&format=geojson&accept-language=en`);            
            setHumanAddress(
                `${response.data.features[0].properties.address.country ? response.data.features[0].properties.address.country : ''} ` +
                `${response.data.features[0].properties.address.city ? response.data.features[0].properties.address.city : ''} ` +
                `${response.data.features[0].properties.address.road ? response.data.features[0].properties.address.road : ''} ` +
                `${response.data.features[0].properties.address.house_number ? response.data.features[0].properties.address.house_number : ''}`
            );
        } catch (err: any) {
            console.log(err);
        }
    }

    return (
        <Box
            width="250px"
            height="250px"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
            backgroundColor="#fff"
            position="relative"
            margin="8px" 
            padding="0px" 
            textAlign="start"
            onMouseEnter={() => {
                getAddressByCoordinates(event.address.coordinates);
                setShowDetails(true)
            }}
            onMouseLeave={() => {
                setHumanAddress("");
                setShowDetails(false)
            }}
            transition="width 0.1s, height 01s"
            _hover={{ width: "260px", height: "260px" }}
        >
            <Box position="absolute" top="9px" left="1px" width="100%" height="100%">
                <LikeButtonSmall setIsLiked={setIsLiked} isLiked={isLiked} eventId={_id} />
            </Box>
            <Link
                href={`/events/${_id}`}
            >
                {/* <Box
                    position="absolute"
                    bottom="0"
                    left="0"
                    right="0"
                    p="1"
                    pr="6"
                    pl="12"
                    display="flex"
                    flexDirection="column"
                    opacity={showDetails ? 1 : 0}
                    transition="opacity 0.3s ease"
                    bg="rgba(255, 255, 255, 0.9)"
                    zIndex={0}
                >
                    <Text
                        fontWeight="semibold"
                        fontSize="sm"
                        cursor="pointer"
                        transition="opacity 0.3s ease"
                        opacity={showDetails ? 1 : 0}
                    >
                        {formattedDateString}
                    </Text>
                    <Text
                        fontWeight="semibold"
                        as="h4"
                        lineHeight="tight"
                        isTruncated
                        fontSize="lg"
                        cursor="pointer"
                        transition="opacity 0.3s ease"
                        opacity={showDetails ? 1 : 0}
                    >
                        {topic}
                    </Text>
                </Box> */}
                <Box
                    position="absolute"
                    bottom="0"
                    left="0"
                    right="0"
                    p="1"
                    pr="6"
                    pl="12"
                    display="flex"
                    flexDirection="column"
                    bg="rgba(255, 255, 255, 0.9)"
                    // transition="opacity 0.3s ease"
                    color='red.500'
                >
                    <Text fontWeight="semibold" fontSize="sm">
                        {formattedDateString}
                    </Text>
                    <Text fontWeight="semibold" as="h4" lineHeight="tight" isTruncated fontSize="lg">
                        {topic}
                    </Text>
                    <Text fontWeight="semibold" as="h4" lineHeight="tight" fontSize="sm">
                        {humanAddress}
                    </Text>
                </Box>
            </Link>
            <Image src={imageUrl} alt={topic} width="100%" height="100%" objectFit="cover" />
        </Box>
    );
};

export default EventItem;
