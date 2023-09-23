import FilterListIcon from "@mui/icons-material/FilterList";
import {
  Box,
  Checkbox,
  Container,
  IconButton,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import bosses from "../data/droplog.json";
import useLocalStorage from "../hook/useLocalStorage";

/**
To obtain the list of all drop logs for droplog.json, do the following:
1. go to this url:
      https://runescape.wiki/w/Boss_collection_log
2. run this command in the console:
      const bossNames = ['Araxxi', 'Arch-Glacor', 'Barrows', 'Rise of the Six', 'Chaos Elemental', 'Commander Zilyana', 'Corporeal Beast', 'Croesus', 'Dagannoth Kings', 'Dragonkin Laboratory', 'General Graardor', 'Giant Mole', 'Gregorovic', 'Helwyr', 'Hermod, the Spirit of War', 'Kalphite King', 'Kalphite Queen', 'Kerapac', 'King Black Dragon', "Kree'arra", "K'ril Tsutsaroth", 'Legiones', 'Liberation of Mazcab', 'The Magister', 'Nex', 'Nex: Angel of Death', 'Queen Black Dragon', 'Raksha', 'Rasial, the First Necromancer', 'Rex Matriarchs', 'The Shadow Reef', 'Solak', 'Telos', 'Temple of Aminishi', 'Twin Furies', 'TzHaar', 'TzKal-Zuk', 'Vindicta & Gorvek', 'Vorago', 'Zamorak, Lord of Chaos']
      const bossImgByName = {}
      const bossNameMapper = {'Kerapac, the bound': 'Kerapac', 'Giant mole':'Giant Mole', 'The Barrows Brothers': 'Barrows', 'The Barrows: Rise of the Six': 'Rise of the Six'}
      const bossTable = document.getElementsByClassName('wikitable')[0]
      bossTable.getElementsByTagName('tbody')[0].getElementsByTagName('tr').forEach(row => {
          const firstCell = row.getElementsByTagName('td')[0]
          if(firstCell) {
              const title = firstCell.getElementsByTagName('a')[1].innerText
              const src = firstCell.getElementsByTagName('img')[0].src.split('?')[0]
              bossImgByName[bossNameMapper[title] || title] = src
          }
      })
      const bosses = []
      document.getElementsByClassName('wikitable').forEach((collectionLogTable, idx) => {
          if(idx > 0 && idx < 41) {
              const bossName = collectionLogTable.previousElementSibling.previousElementSibling.getElementsByClassName('mw-headline')[0].innerText
              const bossNameIdx = bossNames.indexOf(bossName)+1
              if(bossNameIdx == -1) {
                  console.warn(`Boss "${bossName}" was not on the list.  Add it to the end of the list to index the boss correctly`);
              }
              const bossConfig = {name: bossName, id: bossNameIdx, drops: [], imgSrc: bossImgByName[bossName]}
              collectionLogTable.getElementsByTagName('td').forEach(itemCell => {
                  const firstAnchorInItemCell = itemCell.getElementsByTagName('a')[0]
                  if(firstAnchorInItemCell != undefined){
                      const item = firstAnchorInItemCell.title
                      const anchorLink = firstAnchorInItemCell.href
                      const imgTag = firstAnchorInItemCell.getElementsByTagName('img')[0]
                      const imgTagSrc = imgTag.src.split('?')[0]
                      bossConfig.drops.push({id: bossConfig.drops.length+1, name: item, imgSrc: imgTagSrc, link: anchorLink})
                  }
              })
              bosses.push(bossConfig)
          }
      })
      JSON.stringify(bosses)
3. copy the output and paste it into droplog.json (remove leading/trailing quotes)
 */

export default function DropLog() {
  const [logItems, set] = useLocalStorage<[number, number][]>("drop-log", []);
  const [doFilter, setDoFilter] = useLocalStorage<boolean>(
    "drop-log-filter",
    true
  );

  return (
    <Container>
      <Toolbar>
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Boss Drop Log
        </Typography>
        <Tooltip title="Apply Filter">
          <IconButton
            color={doFilter ? "primary" : undefined}
            onClick={() => {
              setDoFilter((prev) => !prev);
            }}
          >
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
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
              boss.drops
                .filter(
                  (drop) =>
                    !doFilter ||
                    !logItems.some(
                      ([bossId, dropId]) =>
                        bossId === boss.id && dropId === drop.id
                    )
                )
                .map((drop) => (
                  <TableRow
                    key={drop.name}
                    sx={{ cursor: "pointer" }}
                    onClick={() => {
                      set((old) => {
                        const exists = old.some(
                          ([bossId, dropId]) =>
                            bossId === boss.id && dropId === drop.id
                        );
                        if (!exists) {
                          return [...old, [boss.id, drop.id]];
                        } else {
                          return old.filter(
                            ([bossId, dropId]) =>
                              !(bossId === boss.id && dropId === drop.id)
                          );
                        }
                      });
                    }}
                    hover
                  >
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box
                          width="32px"
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <img
                            src={boss.imgSrc}
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
                            src={drop.imgSrc}
                            alt={drop.name}
                            style={{
                              height: "auto",
                              width: "auto",
                              maxHeight: "32px",
                              maxWidth: "32px",
                            }}
                          />
                        </Box>
                        <Link
                          href={drop.link}
                          rel="noreferrer"
                          target="_blank"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <Typography>{drop.name}</Typography>
                        </Link>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={logItems.some(
                          ([bossId, dropId]) =>
                            bossId === boss.id && dropId === drop.id
                        )}
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
