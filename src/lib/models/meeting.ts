import { Sequelize, Model, DataTypes, Optional } from "sequelize";

// Define los atributos de la interfaz del modelo
interface MeetingAttributes {
  id: string;
  who: string[];
  when: string;
  since: string;
  until: string;
  duration: string;
  about: string[];
}

// Define las propiedades opcionales para la creación del modelo
interface MeetingCreationAttributes extends Optional<MeetingAttributes, 'id'> {}

// Define la clase del modelo extendiendo de Model
class MeetingInstance extends Model<MeetingAttributes, MeetingCreationAttributes> 
  implements MeetingAttributes {
  public id!: string;
  public who!: string[];
  public when!: string;
  public since!: string;
  public until!: string;
  public duration!: string;
  public about!: string[];
}

const MeetingModel = (sequelize: Sequelize) => {
  MeetingInstance.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      who: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
      when: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      since: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      until: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      duration: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      about: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Meeting",
      timestamps: true,
    }
  );
};

export default MeetingModel;
export type { MeetingInstance, MeetingAttributes, MeetingCreationAttributes };
