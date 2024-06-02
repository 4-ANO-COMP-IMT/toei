import {expect,test,describe} from "vitest";
import {UserLogin} from "../models/userLogin";


describe("[User Entity Tests]", () => {
    test("Should create a new UserLogin entity", () => {
      const user = new UserLogin(
        {
            login: "john_doe",	
            password: "123456",
        }
      );
      expect(user).toBeInstanceOf(UserLogin);
    }
    );
    });