import {expect,test,describe} from "vitest";
import {User} from "../models/user";


describe("[User Entity Tests]", () => {
    test("Should create a new User entity", () => {
      const user = new User(
        {
          name: "John Doe",
            password: "123456",
            birthDate: new Date("1990-01-01"),
            login: "john_doe",
            email: "joh@hotmail.com",	
            cpf: "123.456.789-00"
        }
      );
      expect(user).toBeInstanceOf(User);
    }
    );
    });