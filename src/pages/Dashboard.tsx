import React from "react";
import Card from "../components/Card";

const Dashboard = () => {
    return (
        <div>
            {/* <div>Dashboard</div> */}
            <Card
              title="My Sample Card"
              type="social"
              content="Some note or description"
              url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              imageUrl={null}
              setdelete={() => console.log("Delete clicked")}
              setNotes={() => console.log("Notes opened")}
              index={0}
              time="2025-07-27T12:00:00Z"
            />


        </div>
    )
}

export default Dashboard;