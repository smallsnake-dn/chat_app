const socket = io("http://localhost:3000", {
    autoConnect: true,
    withCredentials: true
})

var current_room

const base_url = "http://localhost:3000"


$('#test').click((e) => {
    socket.emit('test', 'data')
})

socket.on('test', data => {
    alert(data)
})

const join_current_room = () => {
    socket.emit('join_current_room', 'join')
}



$('#chat_list_room li').each((index, element) => {
    element.addEventListener('click', e => {
        const _room = element.getAttribute("id_room")
        console.log({element})
        const select_room = $('.select_room')
        if(select_room) select_room.removeClass('select_room');
        element.classList.add('select_room')
        $('#msg_box').html(element.innerText)
        socket.emit('get_msg', {
            room: _room,
            limit: 10,
            offset: 0
        })
        
        $.ajax({
            url: base_url+"/rooms",
            method: "GET",
            data: {
                room: _room
            },
            xhrFields: {
               withCredentials: true
            }
         }).done((data) => {
            console.log({data})
         })
    })
})


$('#join_room_btn').click((e) => {
    const room_name = $('#room_name').val();
    console.log(room_name)
    socket.emit('join_room', room_name)
    $('#room_name').html("")
})

socket.on('room_exist', (data) => {
    alert(data)
})

socket.on('join_success', data => {
    console.log({
        socket_id: socket.id,
        id: data.id
    })
    alert(data.msg)
    if(socket.id== data.id) {
        $('#chat_list_room').append(`<li>${data.room.name}</li>`)
    }
})

$('#send').click((e) => {
    const select_room = $('.select_room').attr("id_room")
    const msg = $('#typing').val();
    if(msg.length > 0 && select_room) {
        console.log("sendddddddddd")
        socket.emit('send_msg', {
            room: select_room,
            msg
        })
    }
})

socket.on('data_get_msg', data => {
    const ele = data.map(current => `<div>${current.users.name}: ${current.msg}</div>`)
    $('#msg_box').html(ele.join(''))
})



join_current_room()