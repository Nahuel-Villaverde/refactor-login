class UserDTO {
    constructor(user) {
        this.firstName = user.first_name;
        this.lastName = user.last_name;
        this.role = user.role;
    }
}

export default UserDTO;