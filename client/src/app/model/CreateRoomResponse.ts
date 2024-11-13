export interface createRoomResponse {
    status: number,
    user_name: string,
    owner: boolean,
    room_id: string
}

export interface getRoomResponse {
    status: number,
    random_word: string

}