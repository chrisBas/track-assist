import {
    Box,
    Checkbox,
    Container,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import useLocalStorage from "../hook/useLocalStorage";

const bosses: {
  id: number;
  name: string;
  drops: { id: number; name: string; imgSrc?: string }[];
  imgSrc?: string;
}[] = [
  {
    id: 1,
    name: "The Ambassador",
    drops: [
      {
        id: 1,
        name: "Eldritch crossbow limb",
      },
      {
        id: 2,
        name: "Eldritch crossbow mechanism",
      },
      { id: 3, name: "Eldritch crossbow stock" },
      { id: 4, name: "Black stone heart" },
      { id: 5, name: "The Last Offering" },
      { id: 6, name: "Kranon's Ancient Journal" },
      { id: 7, name: "Umbral urn" },
    ],
  },
];

export default function DropLog() {
  const [logItems, set] = useLocalStorage<[number, number][]>("drop-log", []);

  return (
    <Container>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Boss</TableCell>
              <TableCell>Item</TableCell>
              <TableCell>Obtained</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bosses.map((boss) =>
              boss.drops.map((drop) => (
                <TableRow key={drop.name}>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        width="32px"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <img
                          src={
                            boss.imgSrc ||
                            `https://runescape.wiki/images/${boss.name.replaceAll(
                              " ",
                              "_"
                            )}_chathead.png`
                          }
                          alt={boss.name}
                          style={{
                            height: "auto",
                            width: "auto",
                            maxHeight: "32px",
                            maxWidth: "32px",
                          }}
                        />
                      </Box>
                      <Typography>{boss.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        width="32px"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <img
                          src={
                            drop.imgSrc ||
                            `https://runescape.wiki/images/${drop.name.replaceAll(
                              " ",
                              "_"
                            )}_detail.png`
                          }
                          alt={drop.name}
                          style={{
                            height: "auto",
                            width: "auto",
                            maxHeight: "32px",
                            maxWidth: "32px",
                          }}
                        />
                      </Box>
                      <Typography>{drop.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={logItems.some(
                        ([bossId, dropId]) =>
                          bossId === boss.id && dropId === drop.id
                      )}
                      onChange={(e) => {
                        set((old) => {
                          if (e.target.checked) {
                            return [...old, [boss.id, drop.id]];
                          } else {
                            return old.filter(
                              ([bossId, dropId]) =>
                                !(bossId === boss.id && dropId === drop.id)
                            );
                          }
                        });
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
