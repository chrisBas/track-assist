import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Chip,
    Typography,
} from "@mui/material";

const commands: { command: string; description: string }[] = [
  { command: "minikube start", description: "starts the minikube process" },
  {
    command: "minikube status",
    description: "get the status of the minikube service",
  },
  {
    command: "minikube service studio-2 --url",
    description: "similar to port-forward",
  },
  {
    command: "eval $(minikube docker-env)",
    description:
      "now any 'docker' command you run in the current terminal will run against the docker inside the minikube cluster",
  },
  {
    command: "kubectl apply -f studio.yaml",
    description: "runs your kubernetes file",
  },
  {
    command: "kubectl delete -f studio.yaml",
    description: "deletes the instances setup in the previous run",
  },
  { command: "kubectl get services", description: "list all services" },
  { command: "kubectl get deployments", description: "list all deployments" },
  { command: "kubectl get pods", description: "list all pods" },
  {
    command: "kubectl port-forward [podname] 8080:8080",
    description:
      "maps a port on your local machine to a port only available within the kubernetes cluster",
  },
  {
    command: "kubectl describe pod [podname]",
    description: "shows details about pods",
  },
  { command: "docker ps", description: "list all running containers" },
  {
    command: "docker build -t [tagname] .",
    description:
      "builds a container from the Dockerfile located in the current directory (.) with a specific tagname",
  },
];

export default function MinikubeGuide() {
  return (
    <Box>
      <h1>Minikube Guide</h1>
      <p>
        These guides are broken into 2 parts. The first part goes over useful
        commands and information about the topic. The second part uses the
        information from the first part to go over a common use-case.
      </p>
      <Accordion>
        <AccordionSummary>Useful Commands</AccordionSummary>
        <AccordionDetails>
          {commands.map((command) => {
            return (
              <Box>
                <Typography variant="subtitle2">
                  {"> "}
                  {command.command}
                </Typography>
                <Typography variant="body2" paddingLeft="16px">
                  {command.description}
                </Typography>
              </Box>
            );
          })}
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary>Usecases</AccordionSummary>
        <AccordionDetails>
          <Accordion>
            <AccordionSummary>
              <Typography variant="h6">
                Use Minikube and Docker Locally
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">
                Run minikube <Chip label="minikube start" variant="filled" />
              </Typography>
              <Typography variant="body1">
                Confirm it is running{" "}
                <Chip label="minikube status" variant="filled" />
              </Typography>
              <Typography variant="body1">
                Build your container with the tag that matches the kubernetes named resource{" "}
                <Chip label="docker build -t [tagname] ." variant="filled" />
              </Typography>
              <Typography variant="body1">
                Setup your local docker to use the docker inside the minikube{" "}
                <Chip label="eval $(minikube docker-env)" variant="filled" />
              </Typography>
              <Typography variant="body1">
                Confirm docker is using the docker inside minikube{" "}
                <Chip label="docker ps" variant="filled" />
              </Typography>
              <Typography variant="body1">
                Confirm that your kubernetes build file is not using an external
                docker repo to pull images from (property is in
                spec.template.spec.containers[idx].imagePullPolicy on the
                Deployment spec){" "}
                <Chip label="imagePullPolicy: Never" variant="filled" />
              </Typography>
              <Typography variant="body1">
                Add the kubernetes config to minikube{" "}
                <Chip label="kubectl apply -f studio.yaml" variant="filled" />
              </Typography>
              <Typography variant="body1">
                Validate the pod is up and running{" "}
                <Chip label="kubectl get pods" variant="filled" />
              </Typography>
              <Typography variant="body1">
                Open the port to be able to access the service{" "}
                <Chip
                  label="kubectl port-forward [podname] 8080:8080"
                  variant="filled"
                />
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary>
              <Typography variant="h6">
                Use Minikube and Docker Locally with Ingress
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">
                Run minikube <Chip label="minikube start" variant="filled" />
              </Typography>
            </AccordionDetails>
          </Accordion>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
