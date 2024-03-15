'use client'
import { DeleteIcon, EditIcon, QuestionOutlineIcon, TimeIcon } from '@chakra-ui/icons';
import { AbsoluteCenter, Avatar, Badge, Box, Button, Card, CardBody, CardFooter, CardHeader, CircularProgress, CircularProgressLabel, Container, Divider, Flex, Heading, Image, Stack, StackDivider, Tag, TagLabel, Text, useDisclosure, useToast } from "@chakra-ui/react";
import axios from 'axios';
import { redirect, useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SERVER_URL } from '../../../../api';
import { CATEGORY_URLS } from '@/Components/SignUpModal/categories/categories_url';
import LikeButton from '@/Components/LikeButton/LikeButton';
import '../../../Components/LikeButton/LikeButton.css';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import EditEventModal from '../../../Components/EditEventModal/EditEventModal'

export default function EventDetailsPage() {

    const DynamicMap = dynamic(() => import('@/Components/Map/Map'), { ssr: false });
    const [isLoading, setIsLoading] = useState<any>(false);
    const [event, setEvent] = useState<any>({});
    const { id } = useParams<any>();
    const toast = useToast();
    const [isEditable, setIsEditable] = useState(false);
    const [token, setToken] = useState<any>('');
    const [isLiked, setIsLiked] = useState<any>(false);
    const [userID, setUserID] = useState<any>('');
    const [members, setMembers] = useState<any>([]);
    const router = useRouter();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };

    async function fetchEvent() {
        try {
            const response = await axios.get(`${SERVER_URL}/events/${id}`);
            setEvent(response.data);
            setIsLiked(getLikeStatus(response.data, localStorage.getItem("userId")));
        } catch (error: any) {
            toast({
                title: error.response.data.message,
                status: 'error',
                isClosable: true,
            })
        }
    }

    async function joinEvent() {
        try {
            setIsLoading(true);
            const response: any = await axios.put(`${SERVER_URL}/events/join/${id}`, {}, config);
            toast({
                title: "You joined the event",
                status: 'success',
                isClosable: true,
            })
        } catch (error: any) {
            toast({
                title: error.response.data.message,
                status: 'error',
                isClosable: true,
            })
        } finally {
            setIsLoading(false);
        }
    }

    async function deleteEvent() {
        try {
            const response = await axios.delete(`${SERVER_URL}/events/${id}`, config);
            toast({
                title: "Event deleted",
                status: 'success',
                isClosable: true,
            })
            router.push("/");
        } catch (error: any) {
            toast({
                title: error.response.data.message,
                status: 'error',
                isClosable: true,
            })
        }
    }

    async function leaveEvent() {
        try {
            const response = await axios.delete(`${SERVER_URL}/events/leave/${id}`, config);
            toast({
                title: "You left the event",
                status: 'success',
                isClosable: true,
            })
        } catch (error: any) {
            toast({
                title: error.response.data.message,
                status: 'error',
                isClosable: true,
            })
        }
    }


    function handleJoin(e: any) {
        joinEvent();
    }

    function handleLeave(e: any) {
        leaveEvent();
    }

    function handleEdit(e: any) {
        setIsEditable(true);
        onOpen();
    }

    function handleDelete(e: any) {
        deleteEvent();
    }

    useEffect(() => {
        fetchEvent();
    }, [])

    useEffect(() => {
        setToken(localStorage.getItem("accessToken"));
    }, [event]);

    function getLikeStatus(event: any, id: any) {
        return event.savedBy.indexOf(id) === -1 ? false : true;
    }

    const categoryKey: string = event.category;
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "November", "December"];
    const weekDays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];

    async function updateEvent(event: any) {
        try {
            setIsLoading(true);
            const response: any = await axios.put(`${SERVER_URL}/events/${id}`, JSON.stringify(event), config);
            toast({
                title: "Event updated",
                status: 'success',
                isClosable: true,
            })
        } catch (error: any) {
            toast({
                title: error.response.data.message,
                status: 'error',
                isClosable: true,
            })
        } finally {
            setIsLoading(false);
        }
        console.log(event);
    }
    //setIsLoading, createEvent, updateEvent, isEditable, existedEvent, setEvent, isLoading
    return (
        <>
            <EditEventModal isLoading={isLoading} isOpen={isOpen} onClose={onClose} setIsLoading={setIsLoading} createEvent={null} updateEvent={updateEvent} isEditable={isEditable} existedEvent={event} setEvent={setEvent} />
            <Flex flexDirection="column">
                <Box position="relative" display="flex" h="512px" justifyContent="center" alignItems="center">
                    {/* <Box maxW='md' h="auto"> */}
                    <Image
                        // blockSize="auto"
                        objectFit="cover"
                        // maxInlineSize="100%"
                        width="100%"
                        h="100%"
                        src={CATEGORY_URLS[categoryKey as keyof typeof CATEGORY_URLS]} alt=''
                    />
                    <Heading
                        size="2xl"
                        textAlign="center"
                        position="absolute"
                        lineHeight="150px"
                        top="40%"
                        left="0"
                        right="0"
                        bg="rgba(50, 50, 0, 0.75)"
                        color="white"
                        py={2}
                    >
                        {event.topic}
                    </Heading>
                    {/* </Box> */}
                </Box>

                {event.creator && <Box display="flex" alignSelf="center" p="8">
                    <Card width="2xl">
                        <CardHeader>
                            {/* <Stack flexDirection="row" alignItems="baseline"> */}
                            <Flex gap='4' alignItems="center" flexWrap='wrap'>
                                <Text fontSize="4xl">
                                    Creator:
                                </Text>
                                {/* <Box justifySelf="center"> */}
                                <Avatar src={event.creator.imageURL} />
                                {/* </Box> */}
                                <Box display="flex" flexDirection="column">
                                    <Heading size='sm'>{event.creator.firstName + " " + event.creator.lastName}</Heading>
                                    <Text>{event.creator.email}</Text>
                                    <Text>{event.creator.phone}</Text>
                                </Box>
                                <Box ml="auto">
                                    <CircularProgress alignSelf="end" size='75px' value={(event.joinedBy.length / event.membersAmount) * 100} color='red.500'>
                                        <CircularProgressLabel>{event.joinedBy.length}</CircularProgressLabel>
                                    </CircularProgress>
                                </Box>
                            </Flex>
                            <Box>
                                <Divider />
                            </Box>
                        </CardHeader>
                        <CardBody>
                            <Stack spacing="5">
                                <Stack spacing="5" direction="row" wrap="wrap">
                                    <Flex flexDirection="column">
                                        <Heading size="md">Vacant: </Heading>
                                        <Tag mt={2} size='lg' borderRadius='full' bg='red.500'>
                                            <TagLabel color="white" fontSize="2xl" ml={2}>{event.membersAmount === event.joinedBy.length ? 0 : event.membersAmount - event.joinedBy.length} / {event.membersAmount}</TagLabel>
                                        </Tag>
                                    </Flex>
                                    <Flex flexDirection="column">
                                        <Heading size="md">Fees: </Heading>
                                        <Tag mt={2} size='lg' borderRadius='full' bg='red.500'>
                                            <TagLabel color="white" fontSize="2xl" ml={2}>{event.budget} ₪</TagLabel>
                                        </Tag>
                                    </Flex>
                                    <Flex flexDirection="column">
                                        <Tag mt="auto" size='lg' borderRadius='full'>
                                            <TagLabel fontSize="2xl" ml={2}>{event.category}</TagLabel>
                                        </Tag>
                                    </Flex>
                                    <Tag mt="auto" size='lg' borderRadius='full'>
                                        <TimeIcon />
                                        <TagLabel fontSize="2xl" ml={2}>{event.duration} min</TagLabel>
                                    </Tag>
                                    <Box ml="auto" alignSelf="end">
                                        <LikeButton setIsLiked={setIsLiked} isLiked={isLiked} id={id} />
                                    </Box>
                                </Stack>
                                <Flex gap={5}>
                                    <Box flexGrow={5}>
                                        <DynamicMap height="400px" events={[event]} isEventDetails={true} latCenter={event.address.coordinates[0]} lonCenter={event.address.coordinates[1]}/>
                                    </Box>
                                    <Flex flexDirection="column" flexGrow={1}>
                                        <Card flex={1}>
                                            <CardHeader textAlign="center" bg="red.500">
                                                <Heading color="white" size='md'>{monthNames[new Date(event.date).getMonth()]}</Heading>
                                            </CardHeader>
                                            <CardBody>
                                                <Stack divider={<StackDivider />} spacing='4'>
                                                    <Box display="flex" flexDirection="column" alignItems="center">
                                                        <Heading size='xs' textTransform='uppercase'>
                                                            {weekDays[new Date(event.date).getDay()]}
                                                        </Heading>
                                                        <Text pt='2' fontSize='6xl'>
                                                            {new Date(event.date).getDate()}
                                                        </Text>
                                                        <Heading size='md' textTransform='uppercase'>
                                                            {new Date(event.date).getFullYear()}
                                                        </Heading>
                                                    </Box>
                                                    <Heading textAlign="center">
                                                        {new Date(event.date).getHours()}:{(new Date(event.date).getMinutes() < 10 ? '0' : '') + new Date(event.date).getMinutes()}
                                                    </Heading>
                                                </Stack>
                                            </CardBody>
                                        </Card>
                                        <Flex flex={1}></Flex>
                                    </Flex>
                                </Flex>
                                <Box>
                                    <Heading size="md">Members:</Heading>
                                    <Stack direction='row' mt={5}>
                                        {event.joinedBy.map((member: any) => {
                                            return <Box display="flex" flexDirection="column" alignItems="center">
                                                <Link key={member._id} href={`/users/${member._id}`}>
                                                    <Avatar src={member.imageURL} />
                                                </Link>
                                                <Heading size="sm">
                                                    {member.firstName}
                                                </Heading>
                                            </Box>
                                        })}
                                    </Stack>
                                </Box>
                            </Stack>
                        </CardBody>
                        <CardFooter>
                            <Flex gap={4} w="100%">
                                {/* <Box> */}
                                <Button isLoading={isLoading} onClick={handleJoin} colorScheme='red' variant='solid'>
                                    Join
                                </Button>
                                <Button onClick={handleLeave} colorScheme='gray' variant='solid'>
                                    Leave
                                </Button>
                                <Button leftIcon={<EditIcon />} onClick={handleEdit} colorScheme='red' variant='ghost'>
                                    Edit
                                </Button>
                                {/* </Box> */}
                                <Box ml="auto">
                                    <Button leftIcon={<DeleteIcon />} onClick={handleDelete} colorScheme='red' variant='outline'>
                                        Delete
                                    </Button>
                                </Box>
                            </Flex>
                        </CardFooter>
                    </Card>
                </Box>}
            </Flex >
        </>
    )
}