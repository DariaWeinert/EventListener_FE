import React, { useState } from 'react';
import { Flex, Box, FormControl, Input, Button, extendTheme, ChakraProvider, InputGroup, InputRightElement, IconButton, Link } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import SignUpModal from '@/Components/SignUpModal/SignUpModal';
import { Avatar } from '@chakra-ui/react';
import { AiOutlineUser } from 'react-icons/ai';


interface NavBarProps {
  onSearch: (query: string) => void;
  isLoggedIn: boolean;
}

const theme = extendTheme({
  styles: {
    global: {
      body: {
        color: 'red',
      },
    },
  },
  components: {
    Heading: {
      baseStyle: {
        fontSize: '2xl',
      },
    },
    Button: {
      baseStyle: {
        color: 'red',
        paddingY: '10px',
      },
      variants: {
        solidRound: {
          border: '1px solid red',
        },
        outlineRound: {
          border: '1px solid red',
        },
      },
    },
  },
});

const NavBar: React.FC<NavBarProps> = ({ onSearch, isLoggedIn }) => {


  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    onSearch(query);
  };

  const handleCreateNew = () => {
    console.log('Create New button clicked');
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleProfileClick = () => { };

  const handleSearchButtonClick = () => {
    <Link href={`/events`} _hover={{ textDecoration: 'none' }}/>
  };

  return (
    <ChakraProvider theme={theme}>
      <header style={{ position: 'fixed', top: 0, width: '100%', maxWidth: '50%', backgroundColor: '#fff', zIndex: 1000 }}>
        <Flex as="nav" align="center" justify="space-around" p={4} flexWrap="wrap" pr={6} pl={6}>
          <Box>
            <Flex align="center">
              <div className="navbar-brand" style={{ color: 'red', fontSize: '2rem' }}>Event Listener</div>
            </Flex>
          </Box>
          <Box flex="1">
            <FormControl mr={4} mb={4} mt={4}>
              <InputGroup>
                <Input
                  type="text"
                  placeholder="Listen to events..."
                  onChange={handleSearchChange}
                  width="100%"
                  marginLeft="10px"
                />
                <InputRightElement>
                  <IconButton
                    aria-label="Search"
                    colorScheme="red"
                    icon={<SearchIcon />}
                    onClick={handleSearchButtonClick}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </Box>
          <Box>
            {isLoggedIn ? (
              <>
                <Button variant="solidRound" marginLeft="10px" colorScheme="red" mr={4} onClick={handleCreateNew} size="md" fontSize='xs'>
                  Create New
                </Button>
                <Avatar bg='red.500' icon={<AiOutlineUser fontSize='1.5rem' />} onClick={handleProfileClick} />
              </>
            ) : (
              <Button variant="outlineRound" marginLeft="10px" colorScheme="red" onClick={handleOpenModal} size="md" fontSize='xs'>
                Sign Up /
                <br /> Log In
              </Button>
            )}
          </Box>
        </Flex>
        <SignUpModal isOpen={isModalOpen} onClose={handleCloseModal} />
      </header>
    </ChakraProvider>
  );
};

export default NavBar;