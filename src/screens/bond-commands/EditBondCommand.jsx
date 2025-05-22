import React from "react";
import { Card } from "antd";
import { useTranslation } from "react-i18next";
import BondCommandForm from "../../components/bond-commands/BondCommandForm";

const EditBondCommand = () => {
  const { t } = useTranslation();

  return (
    <div style={{ padding: 24, backgroundColor: "white" }}>
      <Card>
        <h1 style={{ marginBottom: 24 }}>
          {t("screens.bondCommand.form.editTitle")}
        </h1>
        <BondCommandForm />
      </Card>
    </div>
  );
};

export default EditBondCommand; 