import './Activity.css'

const content = [
    {time: "13:05", description: "Login page completed"},
    {time: "12:00", description: "Login form completed"},
    {time: "11:03", description: "Image updation"},
    {time: "09:55", description: "Project started"}
];

const Recentcontent = () => {
    return(
        <div className='recent-content'>
            <h3 className='title'>Recent Activities</h3>
            <ul className='content-list'>
                {content.map((cont, index) =>(
                    <li key={index} className='content-details'>
                    <span className='time'>{cont.time}</span>
                    <span className='description'>{cont.description}</span>
                </li>
                ))}
            </ul>
        </div>
    )
}

export default Recentcontent