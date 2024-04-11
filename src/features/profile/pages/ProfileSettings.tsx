import {
  Box,
  Button,
  List,
  ListItem,
  Stack,
  TextField
} from "@mui/material";
import { useState } from "react";
import FabAdd from "../../common/components/FabAdd";
import TopAppBar from "../../common/components/TopAppBar";
import useActiveApp from "../../common/hooks/useActiveApp";
import { useGroupUsers } from "../hooks/useGroupUsers";
import { useGroups } from "../hooks/useGroups";
import { useProfile } from "../hooks/useProfile";

export default function ProfileSettings() {
  // global state
  const { setActiveApp } = useActiveApp();
  const { items: profileList} = useProfile();
  const { items: groups, add: createGroup } = useGroups();
  const { items: groupUsers, add: createGroupUsers } = useGroupUsers();

  // local vars
  const [group, setGroup] = useState("")
  const [groupErrMsg, setGroupErrMsg] = useState("")

  console.log({profileList, groups, groupUsers})

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TopAppBar title={"Profile Settings"} showProfile />
      <Box sx={{ flexGrow: 1, overflow: "scroll" }}>
      <Stack
          pt={1}
          spacing={2}
          sx={{px: '10%'}}
          >
            <TextField error={groupErrMsg !== ""} label={groupErrMsg} placeholder="Create Group" value={group} onChange={(e) => {
                setGroup(e.target.value)
            }} autoFocus/>
            <Button variant="contained" onClick={() => {
                createGroup({group_name: group})
                  .then(res => {
                    createGroupUsers({group_name: group, username: profileList[0].username}).catch(reason => {
                      console.log({reason, action: 'create-group-users'})
                    })
                  })
                  .catch(reason => {
                    if(reason.code === "23505") {
                      setGroupErrMsg("Group already exists")
                    } else {
                      setGroupErrMsg("An unknown error occurred")
                    }
                  })
            }}>Create Group</Button>
          </Stack>
          <List>
            {groups.map((group) => (<ListItem key={group.id}>{group.group_name}</ListItem>))}
          </List>
      </Box>
      <FabAdd
        onClick={() => {
          setActiveApp((prev) => ({ ...prev, page: "New Weight Entry" }));
        }}
      />
    </Box>
  );
}