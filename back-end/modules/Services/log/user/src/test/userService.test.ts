import { createUser } from "../services/userService"; 
import {expect,test,describe} from "vitest";
import {User} from "../models/user";





describe("[User Entity Tests]", () => {
    test("Should create a new User entity", async () => {
      const user = await createUser(
        
         "John Doe",
         "123456",
         new Date("1990-01-01"),
         "john_doe",
         "joh@hotmail.com",	
        
      );
      expect(user).toBeInstanceOf(User);
    }
    , 10000);
    });