/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { ReactNode } from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";

import type { Props } from "@theme/BlogLayout";

import styles from "./styles.module.css";

export default function BlogLayout(props: Props): JSX.Element {
  const { sidebar, children, ...layoutProps } = props;

  return (
    <Layout {...layoutProps}>
      <div className="container margin-vert--lg">
        <div className="row">
          <main
            className={clsx("col", {
              "col--12": true,
              [styles.blogLayout]: true,
            })}
            itemScope
            itemType="http://schema.org/Blog"
          >
            {children}
          </main>
        </div>
      </div>
    </Layout>
  );
}
