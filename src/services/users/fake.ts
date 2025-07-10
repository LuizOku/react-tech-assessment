import { UsersService, UsersResponse, UserData, UsersFilterParams, UsersSortParams } from "./interface";

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
  {
    id: 3,
    firstName: "Bob",
    lastName: "Wilson",
    email: "bob.wilson@example.com",
    image: "https://picsum.photos/id/3/200/300",
    username: "bobwilson",
    phone: "+1234567892",
    address: {
      address: "789 Pine St",
      city: "Chicago",
      state: "IL",
      country: "United States",
      postalCode: "60601"
    },
    company: {
      name: "Marketing Inc",
      department: "Marketing",
      title: "Marketing Manager"
    },
    age: 35,
    gender: "male",
    birthDate: "1988-03-10"
  },
  {
    id: 4,
    firstName: "Miles",
    lastName: "Cummerata",
    email: "miles.cummerata@example.com",
    image: "https://picsum.photos/id/4/200/300",
    username: "milescummerata",
    phone: "+1234567893",
    address: {
      address: "321 Elm St",
      city: "Houston",
      state: "TX",
      country: "United States",
      postalCode: "77001"
    },
    company: {
      name: "Data Solutions",
      department: "Analytics",
      title: "Data Analyst"
    },
    age: 32,
    gender: "male",
    birthDate: "1991-07-18"
  }
];

// Generate more mock users to have enough data for testing
const generateMockUsers = (count: number): UserData[] => {
  const users: UserData[] = [];
  for (let i = 5; i <= count; i++) {
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

  async getAll(
    limit: number = 30,
    skip: number = 0,
    filters?: UsersFilterParams,
    sort?: UsersSortParams
  ): Promise<UsersResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredUsers = [...allMockUsers];

        // Apply filters
        if (filters?.firstName) {
          filteredUsers = filteredUsers.filter(user =>
            user.firstName.toLowerCase().includes(filters.firstName!.toLowerCase())
          );
        }
        if (filters?.lastName) {
          filteredUsers = filteredUsers.filter(user =>
            user.lastName.toLowerCase().includes(filters.lastName!.toLowerCase())
          );
        }

        // Apply sorting
        if (sort?.sortBy && sort?.sortOrder) {
          filteredUsers.sort((a, b) => {
            let aValue = '';
            let bValue = '';

            switch (sort.sortBy) {
              case 'firstName':
                aValue = a.firstName;
                bValue = b.firstName;
                break;
              case 'lastName':
                aValue = a.lastName;
                bValue = b.lastName;
                break;
              case 'email':
                aValue = a.email;
                bValue = b.email;
                break;
              case 'id':
                return sort.sortOrder === 'asc' ? a.id - b.id : b.id - a.id;
              default:
                return 0;
            }

            const result = aValue.localeCompare(bValue);
            return sort.sortOrder === 'asc' ? result : -result;
          });
        }

        // Apply pagination
        const users = filteredUsers.slice(skip, skip + limit);

        resolve({
          users,
          total: filteredUsers.length,
          skip,
          limit
        });
      }, this.latencyDuration);
    });
  }
} 