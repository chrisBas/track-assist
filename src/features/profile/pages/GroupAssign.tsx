import {
  Add,
  Delete,
  KeyboardArrowDown,
  KeyboardArrowRight,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useState } from "react";
import FabAdd from "../../common/components/FabAdd";
import TopAppBar from "../../common/components/TopAppBar";
import useActiveApp from "../../common/hooks/useActiveApp";
import { SpecificRecord } from "../../common/hooks/useSupabaseData";
import { useModalStore } from "../../common/store/modalStore";
import { useGroupUsers } from "../hooks/useGroupUsers";
import { Group, useGroups } from "../hooks/useGroups";
import { useGroupUserStore } from "../store/useGroupUserStore";

export default function GroupAssign() {
  // global state
  const { setActiveApp } = useActiveApp();
  const { items: groups } = useGroups();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <TopAppBar title={"Group Assign"} showProfile />
      <Box sx={{ flexGrow: 1, overflow: "scroll" }}>
        <List>
          {groups.map((group) => {
            return <GroupItem group={group} key={group.id} />;
          })}
        </List>
      </Box>
      <FabAdd
        onClick={() => {
          setActiveApp((prev) => ({ ...prev, page: "Group Creation" }));
        }}
      />
    </Box>
  );
}

function GroupItem({ group }: { group: SpecificRecord<Group> }) {
  // global state
  const { delete: deleteGroup } = useGroups();
  const { items: groupUsers, delete: deleteGroupUser } = useGroupUsers();
  const setModal = useModalStore((state) => state.setModal);
  const { setActiveApp } = useActiveApp();
  const { setGroupName } = useGroupUserStore();

  // local state
  const [open, setOpen] = useState(false);

  // local vars
  const filteredGroupUsers = groupUsers.filter(
    (groupUser) => groupUser.group_name === group.group_name
  );

  return (
    <>
      <ListItemButton onClick={() => setOpen((prev) => !prev)}>
        <ListItemIcon>
          {open ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
        </ListItemIcon>
        <ListItemText primary={group.group_name} />
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            setModal({
              modal: "confirm-delete",
              onDelete: () => {
                deleteGroup(group.id);
              },
            });
          }}
        >
          <Delete />
        </IconButton>
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List disablePadding>
          {filteredGroupUsers.map((groupUser) => {
            return (
              <ListItem key={groupUser.id} sx={{ paddingX: "56px" }}>
                <ListItemText primary={groupUser.username} />
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    setModal({
                      modal: "confirm-delete",
                      onDelete: () => {
                        deleteGroupUser(groupUser.id);
                      },
                    });
                  }}
                >
                  <Delete />
                </IconButton>
              </ListItem>
            );
          })}
          <ListItem sx={{ paddingX: "56px", justifyContent: "end" }}>
            <Button
              startIcon={<Add />}
              variant="contained"
              onClick={() => {
                setGroupName(group.group_name);
                setActiveApp((prev) => ({
                  ...prev,
                  page: "Group User Creation",
                }));
              }}
            >
              Add User
            </Button>
          </ListItem>
        </List>
      </Collapse>
    </>
  );
}
