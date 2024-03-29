import React, { useState, useEffect } from 'react';
import { Flex, Box, IconButton, ChakraProvider, Avatar, Button, useToast, Image, Link, Tooltip } from '@chakra-ui/react';
import { AiOutlineLogin, AiOutlineLogout, AiOutlinePlus } from 'react-icons/ai';
import SignUpModal from '@/Components/SignUpModal/SignUpModal';
import Search from '@/Components/Search/Search';
import useLocalStorage from '@/Hooks/useLocalStorage';
import './NavBar.css'

interface User {
  _id: string;
  imageURL: string;
}

interface NavBarProps {
  onSearch?: (query: string) => void;
  user?: User;
}

const NavBar: React.FC<NavBarProps> = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setLoggedIn] = useLocalStorage<boolean>('isLoggedIn', false);
  const [user_id, setUser_id] = useState('')
  const toast = useToast();


  useEffect(() => {
    const token = window.localStorage.getItem('accessToken');
    if (token) {
      setLoggedIn(true);
    }
  }, [setLoggedIn]);

  useEffect(() => {
    const user_id = localStorage.getItem('userId');
    if (user_id) {
      setUser_id(user_id);
    }
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    window.localStorage.removeItem('accessToken');
    localStorage.clear();
    setLoggedIn(false);
  };

  const handleAddEventClick = () => {
    if (!isLoggedIn) {
      toast({
        title: "Please log in to create an event",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      {/* // <ChakraProvider> */}
      {/* <header className='navbar-container'> */}
      <Box backgroundColor='white' position="fixed" width="100%" top="0" zIndex={999}>
        <Flex
          // as="nav"
          className="NavBarContainer"
          flexDirection='row'
          align="center"
          justify="space-between"
          pr={{base:2, md:6}}
          pl={{base:2, md:6}}
          zIndex={10}
          fontFamily="'Calistoga', serif" 
        >
          <Box>
            <Flex align="center" flexDirection='row' fontFamily="'Calistoga', serif">
                <Box height="50px" w="50px">
              <Image
                src="https://res.cloudinary.com/diunuo4xf/image/upload/v1710235202/EventListener/logo-big_without_bg_hclucu.png"
                alt="EventListener Logo"
                style={{ marginRight: '10px' }}
              />
              </Box>
              <Box display={{base: "none", sm: "none", md: "none", lg: "flex"}} className="navbar-brand" style={{ color: '#E53E3E', fontSize: '2.3rem', marginRight: '1rem' }}>
                EventListener
              </Box>
            </Flex>
          </Box>
          <Box flex="1" display='flex' justifyContent="center" alignItems="center">
            <Search />
          </Box>
          {isLoggedIn ? (
            <Flex alignItems="center">
              <Link href={`/home`} >
                <Tooltip label="Home" placement="bottom">
                  <Box
                    position='static'
                    marginTop='1px'
                    cursor="pointer"
                    w="34px"
                  >
                    <Image
                      src="https://res.cloudinary.com/diunuo4xf/image/upload/v1710258603/icons8-home-67_1_sd77pa.png"
                      alt="Home"
                      boxSize="34px"
                    />
                  </Box>
                </Tooltip>
              </Link>
              <Link href={`/users/${user_id}`} ml={2}>
                <Tooltip label="Profile" placement="bottom">
                  <Avatar bg='red.500' src={user?.imageURL} size="sm" />
                </Tooltip>
              </Link>
              <Tooltip label="Log Out" placement="bottom">
                <Link href="/" onClick={handleLogout} ml={2}>
                  <Avatar bg='red.500' icon={<AiOutlineLogout fontSize='1.5rem' />} size="sm" />
                </Link>
              </Tooltip>
            </Flex>
          ) : (
            <Tooltip label="Log In / Sign Up" placement="bottom" >
              <Link>
                <IconButton
                  colorScheme="red"
                  icon={<AiOutlineLogin style={{ transform: 'rotate(-90deg)', fontSize: '1.5rem' }} />}
                  size="sm"
                  fontSize='md'
                  borderRadius="full"
                  m={1}
                  aria-label="Login"
                  onClick={handleOpenModal}
                  bg="red.500"
                />
              </Link>
            </Tooltip>
          )}
        </Flex>
        <Box mt='10px' mb='15px' display="flex" justifyContent="center" width="100%">
          {isLoggedIn ? (
            <Link href='/events/create_event' textDecoration='none' _hover={{ textDecoration: 'none' }}>
              <Button
                className="CreateEventButton" 
                size="sm"
                colorScheme="red"
                leftIcon={<AiOutlinePlus />}
                width='100vw'
                borderRadius='5px'
                fontSize='md'
              >
                Create Event
              </Button>
            </Link>
          ) : (
            <Button
              size="sm"
              colorScheme="red"
              leftIcon={<AiOutlinePlus />}
              width='100vw'
              onClick={handleAddEventClick}
              borderRadius='5px'
              disabled={!isLoggedIn}
            >
              Create Event
            </Button>
          )}
        </Box>
      </Box>
      <SignUpModal isOpen={isModalOpen} onClose={handleCloseModal} />
      {/* </header> */}
      {/* </ChakraProvider> */}
    </>
  );
};

export default NavBar;