import { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Text, Button } from "@vercel/examples-ui";
import { getCurrentExperiment } from "@lib/optimize";
import { COOKIE_NAME } from "@lib/constants";
import { useGa } from "@lib/useGa";
import OptimizeLayout from "@components/layout";

function implementExperimentA(value) {
  var sections = value.split("-");
  console.log("implementExperimentA", value);
  // if (sections[0] ==  '0') {
  //   console.log("Implementing variant 0");
  //   // Provide code for first section for visitors in the original.
  // } else if (sections[0] == '1') {
  //   console.log("Implementing variant 1");
  //   // Provide code for first section for visitors in first variant.
  // } else {
  //   console.log("Implementing variant 2");
  // }
}

// function implementManyExperiments(value, name) {
//   if (name == '<experiment_id_A>') {
//     // Provide implementation for experiment A
//     if (value ==  '0') {
//       // Provide code for visitors in the original.
//     } else if (value == '1') {
//       // Provide code for visitors in first variant.
//     ...
//   } else if (name == '<experiment_id_B>') {
//     // Provide implementation for experiment B
//     ...
// }

export default function About({ experiment, variant }) {
  const ga = useGa();
  const [exId, setExId] = useState(null);
  const sendEvent = useCallback(() => {
    const event = {
      hitType: "event",
      event_category: "AB Testing",
      event_action: "Clicked button",
      event_label: "AB Testing About button",
      value: "hello!",
    };

    ga('event', 'custom event test');
    ga("event", "random3", event);

    ga("event", "optimize.callback", {
      callback: (combination, experimentId, containerId) => {
        console.log('variant:', combination, 'experimentId: ', experimentId, 'containerId: ', containerId)
        console.log(`http://optimize.google.com/experiences/${experimentId}?` + `containerId=${containerId}`);
      },
    });

    // ga("event", "optimize.callback", {
    //   callback: (value, name) => {
    //     console.log("Experiment with ID: " + name + " is on variant: " + value)
    //   }
    // });

    console.log("sent event:", event);
  }, []);

  useEffect(() => {
    const cookie = Cookies.get(COOKIE_NAME);
    if (ga && cookie) {
      ga("set", "exp", cookie);
    }
    ga("send", "pageview :-)");
  }, [ga]);

  return (
    <>
      <Text variant="h2" className="mb-6">
        About Page
      </Text>
      <Text className="text-lg mb-4">
        You&apos;re currently looking at the variant <b>{variant?.name}</b> in the experiment <b>{experiment?.name}</b>
      </Text>
      <Text className="mb-4">Click the button below to register an event with GA for this variant:</Text>
      <Button variant="secondary" onClick={sendEvent}>
        Send event
      </Button>
    </>
  );
}

About.Layout = OptimizeLayout;

export async function getStaticPaths() {
  const experiment = getCurrentExperiment();

  return {
    paths: experiment.variants.map((v) => ({
      params: { variant: `${experiment.id}.${v.id}` },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const experiment = getCurrentExperiment();
  const [, variantId] = params.variant.split(".");

  // Here you could fetch any data related only to the variant
  return {
    props: {
      // Only send the experiment data required by the page
      experiment: { name: experiment.name },
      variant: experiment.variants.find((v) => String(v.id) === variantId),
    },
  };
}
