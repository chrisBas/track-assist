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
import bosses from "../data/droplog.json";
import useLocalStorage from "../hook/useLocalStorage";

/**
To obtain the list of all drop logs for droplog.json, do the following:
1. go to this url:
      https://runescape.wiki/w/Boss_collection_log
2. run this command in the console:
      const bossImgByName = {}
      const bossNameMapper = {'Kerapac, the bound': 'Kerapac', 'Giant mole':'Giant Mole', 'The Barrows Brothers': 'Barrows'}
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
      document.getElementsByClassName('boss-collection-log').forEach(collectionLogTable => {
          const bossName = collectionLogTable.previousElementSibling.previousElementSibling.getElementsByClassName('mw-headline')[0].innerText
          const bossConfig = {name: bossName, id: bosses.length+1, drops: [], imgSrc: bossImgByName[bossName]}
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
          
      })
      JSON.stringify(bosses)
3. copy the output and paste it into droplog.json (remove leading/trailing quotes)
 */

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
