import { UsersService, UsersResponse, UserData } from "./interface";

const mockUsers: UserData[] = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    image: "https://picsum.photos/id/1/200/300",
    username: "johndoe",
    phone: "+1234567890",
    address: {
      address: "123 Main St",
      city: "New York",
      state: "NY",
      country: "United States",
      postalCode: "10001"
    },
    company: {
      name: "Tech Corp",
      department: "Engineering",
      title: "Software Developer"
    },
    age: 30,
    gender: "male",
    birthDate: "1993-05-15"
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    image: "https://picsum.photos/id/2/200/300",
    username: "janesmith",
    phone: "+1234567891",
    address: {
      address: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      country: "United States",
      postalCode: "90210"
    },
    company: {
      name: "Design Studio",
      department: "Creative",
      title: "UI/UX Designer"
    },
    age: 28,
    gender: "female",
    birthDate: "1995-08-22"
  },
  // Add more mock users...
];

// Generate more mock users to have enough data for testing
const generateMockUsers = (count: number): UserData[] => {
  const users: UserData[] = [];
  for (let i = 3; i <= count; i++) {
    users.push({
      id: i,
      firstName: `FirstName${i}`,
      lastName: `LastName${i}`,
      email: `user${i}@example.com`,
      image: `https://picsum.photos/id/${i}/200/300`,
      username: `user${i}`,
      phone: `+123456789${i}`,
      address: {
        address: `${i} Street`,
        city: `City${i}`,
        state: `State${i}`,
        country: "United States",
        postalCode: `${10000 + i}`
      },
      company: {
        name: `Company${i}`,
        department: `Department${i}`,
        title: `Title${i}`
      },
      age: 20 + (i % 40),
      gender: i % 2 === 0 ? "female" : "male",
      birthDate: `199${i % 10}-0${(i % 9) + 1}-${(i % 28) + 1}`
    });
  }
  return users;
};

const allMockUsers = [...mockUsers, ...generateMockUsers(100)];

export class UsersFakeService extends UsersService {
  private latencyDuration: number;

  constructor(latencyDuration = 1000) {
    super();
    this.latencyDuration = latencyDuration;
  }

  async getAll(limit: number = 30, skip: number = 0): Promise<UsersResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = allMockUsers.slice(skip, skip + limit);
        resolve({
          users,
          total: allMockUsers.length,
          skip,
          limit
        });
      }, this.latencyDuration);
    });
  }
} 