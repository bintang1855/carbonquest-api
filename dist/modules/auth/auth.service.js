import bcrypt from "bcryptjs";
import { generateToken } from "../../middleware/auth.middleware.js";
import { AppError } from "../../middleware/error.middleware.js";
import { OrganizationRepository } from "../organizations/organization.repository.js";
import { UserRepository } from "../users/user.repository.js";
export class AuthService {
    userRepository;
    organizationRepository;
    constructor() {
        this.userRepository = new UserRepository();
        this.organizationRepository = new OrganizationRepository();
    }
    async registerUser(data) {
        const { name, last_name, birth_date, email, phone, password } = data;
        if (!email || !password || !name) {
            throw new AppError("Name, email, and password are required", 400);
        }
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new AppError("Email already exists", 400);
        }
        const hashed = await bcrypt.hash(password, 10);
        const user = await this.userRepository.create({
            name,
            last_name,
            birth_date: birth_date ? new Date(birth_date) : undefined,
            email,
            phone,
            password: hashed,
            profile_image: "", // Default empty string for profile image
        });
        const token = generateToken({ sub: user.id_user, role: "user" });
        const { password: _, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }
    async loginUser(data) {
        const { email, password } = data;
        if (!email || !password) {
            throw new AppError("Email and password are required", 400);
        }
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new AppError("Invalid email or password", 401);
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            throw new AppError("Invalid email or password", 401);
        }
        const token = generateToken({ sub: user.id_user, role: "user" });
        const { password: _, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }
    async registerOrganization(data) {
        const { name, email, password, desc } = data;
        if (!email || !password || !name) {
            throw new AppError("Name, email, and password are required", 400);
        }
        const existingOrg = await this.organizationRepository.findByEmail(email);
        if (existingOrg) {
            throw new AppError("Email already exists", 400);
        }
        const hashed = await bcrypt.hash(password, 10);
        const org = await this.organizationRepository.create({
            name,
            email,
            password: hashed,
            desc,
        });
        const token = generateToken({ sub: org.id_organisasi, role: "org" });
        const { password: _, ...orgWithoutPassword } = org;
        return { org: orgWithoutPassword, token };
    }
    async loginOrganization(data) {
        const { email, password } = data;
        if (!email || !password) {
            throw new AppError("Email and password are required", 400);
        }
        const org = await this.organizationRepository.findByEmail(email);
        if (!org) {
            throw new AppError("Invalid email or password", 401);
        }
        const match = await bcrypt.compare(password, org.password);
        if (!match) {
            throw new AppError("Invalid email or password", 401);
        }
        const token = generateToken({ sub: org.id_organisasi, role: "org" });
        const { password: _, ...orgWithoutPassword } = org;
        return { org: orgWithoutPassword, token };
    }
}
//# sourceMappingURL=auth.service.js.map